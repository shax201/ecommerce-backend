import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderServices } from './orderHistory.service';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import ClientModel from '../../user/client/client.model';
import { decodeBearerTokenAndGetUserId } from '../../../utils/jwt';

const getOrderHistory = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getOrderHistory();
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No catagory found',
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

const getOrderHistoryById = async (req: Request, res: Response) => {
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
        message: 'Catagory fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No catagory found with that ID',
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



export const OrderControllers = {
  getOrderHistory,
  getOrderHistoryById,
  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
      if (!userId) {
        userId = req.user?.userId as string | undefined;
      }
      if (!userId) {
        const email = (req.user?.email as string | undefined)?.trim();
        if (email) {
          const client = await ClientModel.findOne({ email }).select('_id').lean();
          if (client?._id) {
            userId = String(client._id);
          }
        }
      }

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const {
        page = '1',
        limit = '10',
        status,
        search,
        category,
        sort = 'date-desc',
      } = req.query as Record<string, string | undefined>;

      const data = await OrderServices.getOrdersForClient(userId, {
        page: Number(page),
        limit: Number(limit),
        status: status as any,
        search,
        category,
        sort: sort as any,
      });

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },
  async getMyAnalytics(req: AuthRequest, res: Response) {
    try {
      let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
      if (!userId) {
        userId = req.user?.userId as string | undefined;
      }

      if (!userId && req.user?.email) {
        const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
        if (client?._id) userId = String(client._id);
      }

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const [clientDoc, analytics] = await Promise.all([
        ClientModel.findById(userId).lean(),
        OrderServices.getClientAnalytics(userId),
      ]);

      const name = [clientDoc?.firstName, clientDoc?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

      const joinDate = clientDoc?.createdAt
        ? new Date(clientDoc.createdAt).toISOString().slice(0, 10)
        : undefined;

      const membershipTier = (() => {
        const spent = analytics.metrics.totalSpent || 0;
        if (spent >= 5000) return 'Platinum';
        if (spent >= 2000) return 'Gold';
        if (spent >= 500) return 'Silver';
        return 'Bronze';
      })();

      const response = {
        user: {
          name: name || clientDoc?.email || 'Customer',
          email: clientDoc?.email,
          avatar: clientDoc?.image || '/diverse-user-avatars.png',
          joinDate,
          totalOrders: analytics.metrics.totalOrders,
          totalSpent: analytics.metrics.totalSpent,
          loyaltyPoints: analytics.metrics.loyaltyPoints,
          membershipTier,
        },
        metrics: analytics.metrics,
        spendingTrends: analytics.spendingTrends,
        categorySpending: analytics.categorySpending,
        orderAnalytics: analytics.orderAnalytics,
      };

      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },
};