import express from 'express';
import { OrderControllers } from './orderHistory.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { 
  createOrderValidation, 
  updateOrderValidation, 
  orderQueryValidation, 
  orderIdValidation, 
  updateOrderStatusValidation 
} from '../order.validation';

const router = express.Router();

// Public routes (admin only)
router.get('/', OrderControllers.getOrderHistory);
router.get('/:id', orderIdValidation, OrderControllers.getOrderHistoryById);

// Protected routes (authenticated users)
router.post('/', authMiddleware, createOrderValidation, OrderControllers.createOrder);
router.put('/:id', authMiddleware, updateOrderValidation, OrderControllers.updateOrder);
router.delete('/:id', authMiddleware, orderIdValidation, OrderControllers.deleteOrder);
router.patch('/:id/status', authMiddleware, updateOrderStatusValidation, OrderControllers.updateOrderStatus);

// User-specific routes
router.get('/my/orders', authMiddleware, orderQueryValidation, OrderControllers.getMyOrders);
router.get('/my/analytics', authMiddleware, OrderControllers.getMyAnalytics);

export const OrderRoutes = router;