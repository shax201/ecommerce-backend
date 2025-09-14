import mongoose from 'mongoose';
import OrderHistoryModel from './orderHistory/orderHistory.model';

export interface TrackingEvent {
  status: string;
  timestamp: Date;
  location?: string;
  notes?: string;
  updatedBy?: string;
}

export interface TrackingInfo {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  trackingSteps: string[];
  events: TrackingEvent[];
  estimatedDelivery?: Date;
  lastUpdated: Date;
}

export class OrderTrackingService {
  /**
   * Get comprehensive tracking information for an order
   */
  static async getOrderTracking(orderId: string): Promise<TrackingInfo | null> {
    const order = await OrderHistoryModel.findById(orderId)
      .populate('clientID', 'firstName lastName email')
      .populate('shipping', 'address city state zip country phone name')
      .lean();

    if (!order) {
      return null;
    }

    // Build tracking events from tracking steps
    const events: TrackingEvent[] = order.trackingSteps.map((step, index) => ({
      status: step,
      timestamp: new Date(order.createdAt.getTime() + (index * 24 * 60 * 60 * 1000)), // Simulate progression
      location: this.getLocationForStatus(step),
      notes: this.getNotesForStatus(step),
    }));

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      trackingSteps: order.trackingSteps,
      events,
      estimatedDelivery: order.estimatedDeliveryDate,
      lastUpdated: order.updatedAt,
    };
  }

  /**
   * Update order status with tracking information
   */
  static async updateOrderStatus(
    orderId: string, 
    status: string, 
    notes?: string, 
    updatedBy?: string
  ): Promise<boolean> {
    try {
      const order = await OrderHistoryModel.findById(orderId);
      if (!order) {
        return false;
      }

      // Add new status to tracking steps if it's not already there
      if (!order.trackingSteps.includes(status)) {
        order.trackingSteps.push(status);
      }

      // Update order with new status and notes
      await OrderHistoryModel.findByIdAndUpdate(orderId, {
        status,
        trackingSteps: order.trackingSteps,
        notes: notes || order.notes,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  /**
   * Get tracking status for multiple orders
   */
  static async getBulkTracking(orderIds: string[]): Promise<TrackingInfo[]> {
    const orders = await OrderHistoryModel.find({
      _id: { $in: orderIds.map(id => new mongoose.Types.ObjectId(id)) }
    }).lean();

    const trackingInfos: TrackingInfo[] = [];

    for (const order of orders) {
      const events: TrackingEvent[] = order.trackingSteps.map((step, index) => ({
        status: step,
        timestamp: new Date(order.createdAt.getTime() + (index * 24 * 60 * 60 * 1000)),
        location: this.getLocationForStatus(step),
        notes: this.getNotesForStatus(step),
      }));

      trackingInfos.push({
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        trackingSteps: order.trackingSteps,
        events,
        estimatedDelivery: order.estimatedDeliveryDate,
        lastUpdated: order.updatedAt,
      });
    }

    return trackingInfos;
  }

  /**
   * Get orders by status with pagination
   */
  static async getOrdersByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: TrackingInfo[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      OrderHistoryModel.find({ status })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OrderHistoryModel.countDocuments({ status })
    ]);

    const trackingInfos: TrackingInfo[] = [];

    for (const order of orders) {
      const events: TrackingEvent[] = order.trackingSteps.map((step, index) => ({
        status: step,
        timestamp: new Date(order.createdAt.getTime() + (index * 24 * 60 * 60 * 1000)),
        location: this.getLocationForStatus(step),
        notes: this.getNotesForStatus(step),
      }));

      trackingInfos.push({
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        trackingSteps: order.trackingSteps,
        events,
        estimatedDelivery: order.estimatedDeliveryDate,
        lastUpdated: order.updatedAt,
      });
    }

    return {
      orders: trackingInfos,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Get tracking statistics
   */
  static async getTrackingStats(): Promise<{
    totalOrders: number;
    statusCounts: Record<string, number>;
    averageProcessingTime: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          statusCounts: {
            $push: '$status'
          },
          processingTimes: {
            $push: {
              $subtract: ['$updatedAt', '$createdAt']
            }
          }
        }
      },
      {
        $project: {
          totalOrders: 1,
          statusCounts: {
            $reduce: {
              input: '$statusCounts',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [{
                        k: '$$this',
                        v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] }
                      }]
                    ]
                  }
                ]
              }
            }
          },
          averageProcessingTime: {
            $avg: '$processingTimes'
          }
        }
      }
    ];

    const result = await OrderHistoryModel.aggregate(pipeline);
    const stats = result[0] || { totalOrders: 0, statusCounts: {}, averageProcessingTime: 0 };

    return {
      totalOrders: stats.totalOrders,
      statusCounts: stats.statusCounts,
      averageProcessingTime: Math.round(stats.averageProcessingTime / (1000 * 60 * 60 * 24)) // Convert to days
    };
  }

  private static getLocationForStatus(status: string): string {
    const locations: Record<string, string> = {
      'pending': 'Order Processing Center',
      'processing': 'Warehouse',
      'shipped': 'In Transit',
      'delivered': 'Delivered',
      'cancelled': 'Order Cancelled'
    };
    return locations[status] || 'Unknown';
  }

  private static getNotesForStatus(status: string): string {
    const notes: Record<string, string> = {
      'pending': 'Your order has been received and is being prepared',
      'processing': 'Your order is being processed and packed',
      'shipped': 'Your order has been shipped and is on its way',
      'delivered': 'Your order has been successfully delivered',
      'cancelled': 'Your order has been cancelled'
    };
    return notes[status] || '';
  }
}
