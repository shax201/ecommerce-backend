import express from 'express';
import * as OrdersController from './orders.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { 
  createOrderValidation, 
  updateOrderValidation, 
  orderQueryValidation, 
  orderIdValidation, 
  updateOrderStatusValidation 
} from './order.validation';

const router = express.Router();

// ===== PUBLIC ROUTES (Admin only) =====
router.get('/', OrdersController.getAllOrders);
router.get('/analytics', OrdersController.getOrderAnalytics);

// ===== PROTECTED ROUTES (Authenticated users) =====
router.post('/', authMiddleware, createOrderValidation, OrdersController.createOrder);
router.get('/user', authMiddleware, orderQueryValidation, OrdersController.getUserOrders);
router.get('/user/:userId', authMiddleware, orderQueryValidation, OrdersController.getUserOrders);
router.get('/:id', orderIdValidation, OrdersController.getOrderById);
router.put('/:id', authMiddleware, updateOrderValidation, OrdersController.updateOrder);
router.patch('/:id/status', authMiddleware, updateOrderStatusValidation, OrdersController.updateOrderStatus);
router.delete('/:id', authMiddleware, orderIdValidation, OrdersController.deleteOrder);
router.get('/:id/tracking', orderIdValidation, OrdersController.getOrderTracking);

export const OrdersRoutes = router;
