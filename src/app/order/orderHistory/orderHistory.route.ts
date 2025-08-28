import express from 'express';
import { OrderControllers } from './orderHistory.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', OrderControllers.getOrderHistory );
router.get('/my', authMiddleware, OrderControllers.getMyOrders);
router.get('/analytics', authMiddleware, OrderControllers.getMyAnalytics);
// Use a distinct segment to avoid collisions with static paths like /analytics
router.get('/history/:id', OrderControllers.getOrderHistoryById);
export const OrderRoutes = router;