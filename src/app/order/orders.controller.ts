import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderServices } from './orderHistory/orderHistory.service';
import { OrderAnalyticsService } from './orderAnalytics.service';
import { OrderTrackingService } from './orderTracking.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { UserManagementService } from '../user/userManagement/userManagement.service';
import { decodeBearerTokenAndGetUserId } from '../../utils/jwt';

// ===== GET ALL ORDERS (Admin) =====
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getOrderHistory();
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== GET ORDER BY ID =====
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id?.trim();

    if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        data: null,
      });
    }

    const result = await OrderServices.getOrderHistoryById(trimmedId);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Order fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== GET USER ORDERS =====
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
    if (!userId) {
      userId = req.user?.userId as string | undefined;
    }
    if (!userId && req.user?.email) {
      const user = await UserManagementService.getUserByEmail(req.user.email as string);
      if (user?._id) userId = String(user._id);
    }

    // If userId is provided in params, use it (for admin viewing user orders)
    const paramUserId = req.params.userId;
    if (paramUserId && paramUserId !== 'undefined') {
      userId = paramUserId;
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not found',
      });
    }

    const result = await OrderServices.getOrderHistoryByUserId(userId);
    res.status(200).json({
      success: true,
      message: 'User orders fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== CREATE ORDER =====
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
    if (!userId) {
      userId = req.user?.userId as string | undefined;
    }
    if (!userId && req.user?.email) {
      const user = await UserManagementService.getUserByEmail(req.user.email as string);
      if (user?._id) userId = String(user._id);
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not found',
      });
    }

    const orderData = { ...req.body, user: userId };
    const result = await OrderServices.createOrder(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== UPDATE ORDER =====
export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id?.trim();

    if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        data: null,
      });
    }

    const result = await OrderServices.updateOrder(trimmedId, req.body);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== UPDATE ORDER STATUS =====
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const trimmedId = id?.trim();

    if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        data: null,
      });
    }

    const result = await OrderServices.updateOrderStatus(trimmedId, status);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== DELETE ORDER =====
export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id?.trim();

    if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        data: null,
      });
    }

    const result = await OrderServices.deleteOrder(trimmedId);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== GET ORDER ANALYTICS =====
export const getOrderAnalytics = async (req: Request, res: Response) => {
  try {
    const result = await OrderAnalyticsService.getOrderAnalytics();
    res.status(200).json({
      success: true,
      message: 'Order analytics fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== GET ORDER TRACKING =====
export const getOrderTracking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id?.trim();

    if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        data: null,
      });
    }

    const result = await OrderTrackingService.getOrderTracking(trimmedId);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Order tracking fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order tracking not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
