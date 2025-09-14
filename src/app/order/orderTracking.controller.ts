import { Request, Response } from 'express';
import { OrderTrackingService } from './orderTracking.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { param, query } from 'express-validator';

const getOrderTracking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const trackingInfo = await OrderTrackingService.getOrderTracking(id);

    if (!trackingInfo) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tracking information retrieved successfully',
      data: trackingInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tracking information',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const getBulkTracking = async (req: Request, res: Response) => {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs array is required',
      });
    }

    const trackingInfos = await OrderTrackingService.getBulkTracking(orderIds);

    res.status(200).json({
      success: true,
      message: 'Bulk tracking information retrieved successfully',
      data: trackingInfos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bulk tracking information',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const getOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      });
    }

    const result = await OrderTrackingService.getOrdersByStatus(
      status,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      message: `Orders with status '${status}' retrieved successfully`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders by status',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const getTrackingStats = async (req: Request, res: Response) => {
  try {
    const stats = await OrderTrackingService.getTrackingStats();

    res.status(200).json({
      success: true,
      message: 'Tracking statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tracking statistics',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      });
    }

    const updatedBy = req.user?.userId || 'system';
    const success = await OrderTrackingService.updateOrderStatus(id, status, notes, updatedBy);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or update failed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const OrderTrackingControllers = {
  getOrderTracking,
  getBulkTracking,
  getOrdersByStatus,
  getTrackingStats,
  updateOrderStatus,
};
