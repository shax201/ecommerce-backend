import { CourierService } from './CourierService';
import OrderHistoryModel from '../order/orderHistory/orderHistory.model';
import { ICourierOrderData } from './courier.types';
import { CourierType } from './courier.types';

export class CourierOrderIntegrationService {
  private courierService: CourierService;

  constructor() {
    this.courierService = new CourierService();
  }

  async createCourierOrderFromExistingOrder(orderId: string, courier: CourierType): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // Get order with populated shipping address
      const order = await OrderHistoryModel.findById(orderId).populate('shipping');
     
      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      if (!order.shipping) {
        return {
          success: false,
          error: 'Order does not have a shipping address'
        };
      }


      // Convert order to courier format
      const shipping = order.shipping as any; // Type assertion for populated shipping
      const courierOrderData: ICourierOrderData = {
        orderNumber: order.orderNumber,
        customerName: shipping.name || 'Unknown',
        customerPhone: shipping.phone?.toString() || 'Unknown',
        customerAddress: shipping.address || 'Unknown',
        customerCity: shipping.city || 'Unknown',
        customerArea: shipping.state || 'Unknown',
        customerPostCode: shipping.zip,
        items: [], // This would need to be populated from order products
        deliveryCharge: 0, // This would be calculated
        totalAmount: order.totalPrice,
        notes: order.notes,
        merchantOrderId: order.orderNumber
      };

      // Create order with courier
      const result = await this.courierService.createOrder(courier, courierOrderData);

      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to create courier order'
        };
      }

      // Update order with courier information
      await OrderHistoryModel.findByIdAndUpdate(orderId, {
        courierBooking: courier,
        consignmentId: result.consignmentId,
        trackingNumber: result.trackingNumber,
        courierStatus: 'pending',
        courierDeliveryFee: result.deliveryFee
      });

      return {
        success: true,
        data: {
          orderId,
          courier,
          consignmentId: result.consignmentId,
          trackingNumber: result.trackingNumber,
          deliveryFee: result.deliveryFee
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Internal server error'
      };
    }
  }

  async updateOrderStatusFromCourier(orderId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // Get order from database
      const order = await OrderHistoryModel.findById(orderId);
      
      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      if (!order.consignmentId || !order.courierBooking) {
        return {
          success: false,
          error: 'Order does not have courier information'
        };
      }

      // Get status from courier
      const result = await this.courierService.getStatus(
        order.courierBooking as CourierType, 
        order.consignmentId
      );
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to get order status'
        };
      }

      // Update order status and tracking steps
      await OrderHistoryModel.findByIdAndUpdate(orderId, {
        courierStatus: result.status,
        courierTrackingSteps: result.trackingSteps?.map(step => ({
          status: step.status,
          timestamp: new Date(step.timestamp),
          location: step.location,
          note: step.note
        }))
      });

      return {
        success: true,
        data: {
          orderId,
          courier: order.courierBooking,
          status: result.status,
          trackingSteps: result.trackingSteps
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Internal server error'
      };
    }
  }

  async getOrderTrackingInfo(orderId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // Get order from database
      const order = await OrderHistoryModel.findById(orderId);
      
      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      if (!order.consignmentId || !order.courierBooking) {
        return {
          success: false,
          error: 'Order does not have courier information'
        };
      }

      // Try to get tracking information from courier, but fallback to database data
      let courierStatus = order.courierStatus || order.status;
      let courierTrackingSteps = order.courierTrackingSteps || [];
      
      try {
        const result = await this.courierService.getStatus(
          order.courierBooking as CourierType, 
          order.consignmentId
        );
        
        if (result.success) {
          courierStatus = (result.status as any) || courierStatus;
          courierTrackingSteps = result.trackingSteps?.map(step => ({
            status: step.status,
            timestamp: typeof step.timestamp === 'string' ? new Date(step.timestamp) : step.timestamp,
            location: step.location,
            note: step.note
          })) || courierTrackingSteps;
        }
      } catch (error) {
        console.warn('Failed to get courier status, using database data:', error);
        // Continue with database data
      }

      return {
        success: true,
        data: {
          orderId,
          orderNumber: order.orderNumber,
          courier: order.courierBooking,
          consignmentId: order.consignmentId,
          trackingNumber: order.trackingNumber,
          status: courierStatus,
          trackingSteps: courierTrackingSteps,
          courierStatus: order.courierStatus,
          courierTrackingSteps: order.courierTrackingSteps,
          deliveryFee: order.courierDeliveryFee,
          estimatedDelivery: order.courierEstimatedDelivery,
          createdAt: (order as any).createdAt || new Date(),
          updatedAt: (order as any).updatedAt || new Date()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Internal server error'
      };
    }
  }

  async calculateDeliveryPrice(courier: CourierType, orderId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // Get order with populated shipping address
      const order = await OrderHistoryModel.findById(orderId).populate('shipping');
      
      if (!order || !order.shipping) {
        return {
          success: false,
          error: 'Order or shipping address not found'
        };
      }

      // Prepare price calculation parameters
      const shipping = order.shipping as any; // Type assertion for populated shipping
      const priceParams = {
        item_type: 2, // Parcel
        item_weight: 0.5, // Default weight, should be calculated from products
        item_quantity: order.quantity,
        delivery_type: 48, // 48 hours delivery
        recipient_city: shipping.city,
        recipient_zone: shipping.state
      };

      const result = await this.courierService.calculatePrice(courier, priceParams);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to calculate delivery price'
        };
      }

      return {
        success: true,
        data: {
          courier,
          orderId,
          deliveryFee: result.deliveryFee,
          estimatedDeliveryTime: result.estimatedDeliveryTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Internal server error'
      };
    }
  }

  async getAvailableCouriersForOrder(orderId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const availableCouriers = await this.courierService.getAvailableCouriers();
      
      // Get order to check if it already has a courier
      const order = await OrderHistoryModel.findById(orderId);
      const currentCourier = order?.courierBooking;

      return {
        success: true,
        data: {
          availableCouriers,
          currentCourier,
          canChangeCourier: !currentCourier || order?.courierStatus === 'pending'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get available couriers'
      };
    }
  }
}
