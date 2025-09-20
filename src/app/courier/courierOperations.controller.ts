import { Request, Response } from 'express';
import { CourierService } from './CourierService';
import { ICourierOrderData } from './courier.types';

const courierService = new CourierService();

export class CourierOperationsController {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      const orderData: ICourierOrderData = req.body;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const result = await courierService.createOrder(courier as 'pathao' | 'steadfast', orderData);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to create order',
          error: result.error
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: `Order created successfully with ${courier}`,
        data: result.data,
        consignmentId: result.consignmentId,
        trackingNumber: result.trackingNumber,
        deliveryFee: result.deliveryFee
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async bulkOrder(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      const { orders } = req.body;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      if (!Array.isArray(orders) || orders.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Orders array is required and must not be empty'
        });
        return;
      }

      const result = await courierService.bulkOrder(courier as 'pathao' | 'steadfast', orders);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to create bulk orders',
          error: result.error
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: `Bulk orders created successfully with ${courier}`,
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

  async getOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { courier, consignmentId } = req.params;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      if (!consignmentId) {
        res.status(400).json({
          success: false,
          message: 'Consignment ID is required'
        });
        return;
      }

      const result = await courierService.getStatus(courier as 'pathao' | 'steadfast', consignmentId);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to get order status',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          status: result.status,
          trackingSteps: result.trackingSteps
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async calculatePrice(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      const params = req.body;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const result = await courierService.calculatePrice(courier as 'pathao' | 'steadfast', params);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to calculate price',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          deliveryFee: result.deliveryFee,
          estimatedDeliveryTime: result.estimatedDeliveryTime
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getAvailableCouriers(req: Request, res: Response): Promise<void> {
    try {
      const couriers = await courierService.getAvailableCouriers();
      
      res.status(200).json({
        success: true,
        data: couriers
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get available couriers',
        error: error.message
      });
    }
  }

  async validateCourier(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;

      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const isValid = await courierService.validateCourierCredentials(courier as 'pathao' | 'steadfast');
      
      res.status(200).json({
        success: true,
        data: {
          courier,
          isValid,
          message: isValid ? 'Courier credentials are valid' : 'Courier credentials are invalid or inactive'
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to validate courier',
        error: error.message
      });
    }
  }
}
