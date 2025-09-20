import { Request, Response } from 'express';
import { CourierOrderIntegrationService } from './courierOrderIntegration.service';
import { CourierOrdersService } from './courierOrders.service';

const courierOrderIntegrationService = new CourierOrderIntegrationService();
const courierOrdersService = new CourierOrdersService();

export class CourierOrderController {
  async createOrderWithCourier(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { courier } = req.body;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const result = await courierOrderIntegrationService.createCourierOrderFromExistingOrder(
        orderId, 
        courier as 'pathao' | 'steadfast'
      );
      


      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to create courier order',
          error: result.error
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: `Order created successfully with ${courier}`,
        data: result.data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      const result = await courierOrderIntegrationService.updateOrderStatusFromCourier(orderId);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to update order status',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getOrderTracking(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      const result = await courierOrderIntegrationService.getOrderTrackingInfo(orderId);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to get tracking information',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async calculateDeliveryPrice(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { courier } = req.body;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const result = await courierOrderIntegrationService.calculateDeliveryPrice(
        courier as 'pathao' | 'steadfast', 
        orderId
      );
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to calculate delivery price',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getAvailableCouriersForOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      const result = await courierOrderIntegrationService.getAvailableCouriersForOrder(orderId);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to get available couriers',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getCourierOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters = {
        search: req.query.search as string,
        courier: req.query.courier as 'pathao' | 'steadfast',
        status: req.query.status as string,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string
      };

      const result = await CourierOrdersService.getCourierOrders(page, limit, filters);
      
      res.status(200).json({
        success: true,
        data: {
          orders: result.orders,
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courier orders',
        error: error.message
      });
    }
  }

  async getCourierOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      
      const order = await CourierOrdersService.getCourierOrderById(orderId);
      
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Courier order not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courier order',
        error: error.message
      });
    }
  }

  async getCourierOrdersStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await CourierOrdersService.getCourierOrdersStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courier orders statistics',
        error: error.message
      });
    }
  }

  async deleteCourierOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      const result = await courierOrdersService.deleteCourierOrder(orderId);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to delete order',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async bulkDeleteCourierOrders(req: Request, res: Response): Promise<void> {
    try {
      const { orderIds } = req.body;

      if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Order IDs are required and must be an array'
        });
        return;
      }

      const result = await courierOrdersService.bulkDeleteCourierOrders(orderIds);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to delete orders',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} orders deleted successfully`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}
