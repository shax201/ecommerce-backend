import mongoose from 'mongoose';
import OrderHistoryModel from '../order/orderHistory/orderHistory.model';

export interface CourierOrderFilters {
  search?: string;
  courier?: 'pathao' | 'steadfast';
  status?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface CourierOrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CourierOrder {
  id: string;
  orderId: string;
  courier: 'pathao' | 'steadfast';
  consignmentId?: string;
  trackingNumber?: string;
  status: string;
  courierStatus?: string;
  deliveryFee?: number;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  totalAmount: number;
  notes?: string;
}

export class CourierOrdersService {
  /**
   * Get courier orders with pagination and filters
   */
  static async getCourierOrders(
    page: number = 1,
    limit: number = 10,
    filters: CourierOrderFilters = {}
  ): Promise<{
    orders: CourierOrder[];
    pagination: CourierOrderPagination;
  }> {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    // Build match stage for filtering
    const matchStage: any = {
      courierBooking: { $exists: true, $ne: null } // Only orders with courier booking
    };

    // Apply filters
    if (filters.courier) {
      matchStage.courierBooking = filters.courier;
    }

    if (filters.status) {
      matchStage.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      matchStage.createdAt = {};
      if (filters.dateFrom) {
        matchStage.createdAt.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        matchStage.createdAt.$lte = new Date(filters.dateTo);
      }
    }

    // Search functionality
    if (filters.search) {
      matchStage.$or = [
        { orderNumber: { $regex: filters.search, $options: 'i' } },
        { consignmentId: { $regex: filters.search, $options: 'i' } },
        { trackingNumber: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'shippingaddresses',
          localField: 'shipping',
          foreignField: '_id',
          as: 'shippingInfo'
        }
      },
      {
        $unwind: {
          path: '$shippingInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          orderNumber: 1,
          courierBooking: 1,
          consignmentId: 1,
          trackingNumber: 1,
          status: 1,
          courierStatus: 1,
          courierDeliveryFee: 1,
          courierEstimatedDelivery: 1,
          totalPrice: 1,
          notes: 1,
          createdAt: 1,
          updatedAt: 1,
          customerName: '$shippingInfo.name',
          customerPhone: '$shippingInfo.phone',
          customerAddress: '$shippingInfo.address'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ];

    // Get total count
    const countPipeline = [
      { $match: matchStage },
      { $count: 'total' }
    ];

    const [orders, countResult] = await Promise.all([
      OrderHistoryModel.aggregate([
        ...pipeline,
        { $skip: skip },
        { $limit: safeLimit }
      ] as any),
      OrderHistoryModel.aggregate(countPipeline as any)
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    // Transform orders to match frontend interface
    const transformedOrders: CourierOrder[] = orders.map((order: any) => ({
      id: order._id.toString(),
      orderId: order.orderNumber,
      courier: order.courierBooking,
      consignmentId: order.consignmentId,
      trackingNumber: order.trackingNumber,
      status: order.status,
      courierStatus: order.courierStatus,
      deliveryFee: order.courierDeliveryFee,
      estimatedDelivery: order.courierEstimatedDelivery,
        createdAt: (order as any).createdAt,
        updatedAt: (order as any).updatedAt,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      totalAmount: order.totalPrice,
      notes: order.notes
    }));

    return {
      orders: transformedOrders,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages
      }
    };
  }

  /**
   * Get courier order by ID
   */
  static async getCourierOrderById(orderId: string): Promise<CourierOrder | null> {
    const order = await OrderHistoryModel.findOne({
      _id: orderId,
      courierBooking: { $exists: true, $ne: null }
    }).populate('shipping');

    if (!order) {
      return null;
    }

    const shipping = order.shipping as any;

    return {
      id: order._id.toString(),
      orderId: order.orderNumber,
      courier: order.courierBooking!,
      consignmentId: order.consignmentId,
      trackingNumber: order.trackingNumber,
      status: order.status,
      courierStatus: order.courierStatus,
      deliveryFee: order.courierDeliveryFee,
      estimatedDelivery: order.courierEstimatedDelivery,
        createdAt: (order as any).createdAt,
        updatedAt: (order as any).updatedAt,
      customerName: shipping?.name,
      customerPhone: shipping?.phone,
      customerAddress: shipping?.address,
      totalAmount: order.totalPrice,
      notes: order.notes
    };
  }

  /**
   * Get courier orders statistics
   */
  static async getCourierOrdersStats(): Promise<{
    totalOrders: number;
    ordersByCourier: Record<string, number>;
    ordersByStatus: Record<string, number>;
    totalDeliveryFees: number;
    averageDeliveryFee: number;
  }> {
    const pipeline = [
      {
        $match: {
          courierBooking: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalDeliveryFees: { $sum: { $ifNull: ['$courierDeliveryFee', 0] } },
          courierBreakdown: {
            $push: '$courierBooking'
          },
          statusBreakdown: {
            $push: '$status'
          }
        }
      },
      {
        $project: {
          totalOrders: 1,
          totalDeliveryFees: 1,
          averageDeliveryFee: {
            $divide: ['$totalDeliveryFees', '$totalOrders']
          },
          courierBreakdown: 1,
          statusBreakdown: 1
        }
      }
    ];

    const [result] = await OrderHistoryModel.aggregate(pipeline);

    if (!result) {
      return {
        totalOrders: 0,
        ordersByCourier: {},
        ordersByStatus: {},
        totalDeliveryFees: 0,
        averageDeliveryFee: 0
      };
    }

    // Count courier breakdown
    const ordersByCourier: Record<string, number> = {};
    result.courierBreakdown.forEach((courier: string) => {
      ordersByCourier[courier] = (ordersByCourier[courier] || 0) + 1;
    });

    // Count status breakdown
    const ordersByStatus: Record<string, number> = {};
    result.statusBreakdown.forEach((status: string) => {
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });

    return {
      totalOrders: result.totalOrders,
      ordersByCourier,
      ordersByStatus,
      totalDeliveryFees: result.totalDeliveryFees,
      averageDeliveryFee: Math.round(result.averageDeliveryFee * 100) / 100
    };
  }

  async deleteCourierOrder(orderId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const order = await OrderHistoryModel.findById(orderId);
      
      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      if (!order.courierBooking) {
        return {
          success: false,
          error: 'Order does not have courier information'
        };
      }

      // Only allow deletion of pending orders
      if (order.courierStatus && !['pending', 'cancelled'].includes(order.courierStatus)) {
        return {
          success: false,
          error: 'Cannot delete order that is already in progress or delivered'
        };
      }

      await OrderHistoryModel.findByIdAndDelete(orderId);

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete order'
      };
    }
  }

  async bulkDeleteCourierOrders(orderIds: string[]): Promise<{
    success: boolean;
    deletedCount: number;
    error?: string;
  }> {
    try {
      // Check which orders can be deleted
      const orders = await OrderHistoryModel.find({
        _id: { $in: orderIds },
        courierBooking: { $exists: true, $ne: null }
      });

      const deletableOrders = orders.filter(order => 
        !order.courierStatus || ['pending', 'cancelled'].includes(order.courierStatus)
      );

      if (deletableOrders.length === 0) {
        return {
          success: false,
          deletedCount: 0,
          error: 'No orders can be deleted (only pending or cancelled orders can be deleted)'
        };
      }

      const result = await OrderHistoryModel.deleteMany({
        _id: { $in: deletableOrders.map(order => order._id) }
      });

      return {
        success: true,
        deletedCount: result.deletedCount
      };
    } catch (error: any) {
      return {
        success: false,
        deletedCount: 0,
        error: error.message || 'Failed to delete orders'
      };
    }
  }
}
