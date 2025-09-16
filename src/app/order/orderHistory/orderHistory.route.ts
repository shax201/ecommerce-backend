import express from 'express';
import { OrderControllers } from './orderHistory.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';
import { 
  createOrderValidation, 
  updateOrderValidation, 
  orderQueryValidation, 
  orderIdValidation, 
  updateOrderStatusValidation 
} from '../order.validation';

const router = express.Router();

// Admin routes (require orders read permission)
router.get('/', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrderControllers.getOrderHistory
);
router.get('/:id', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  orderIdValidation, 
  OrderControllers.getOrderHistoryById
);

// Protected routes (authenticated users with orders permissions)
router.post('/', 
  authMiddleware, 
  requirePermission('orders', 'create'), 
  createOrderValidation, 
  OrderControllers.createOrder
);
router.put('/:id', 
  authMiddleware, 
  requirePermission('orders', 'update'), 
  updateOrderValidation, 
  OrderControllers.updateOrder
);
router.delete('/:id', 
  authMiddleware, 
  requirePermission('orders', 'delete'), 
  orderIdValidation, 
  OrderControllers.deleteOrder
);
router.patch('/:id/status', 
  authMiddleware, 
  requirePermission('orders', 'update'), 
  updateOrderStatusValidation, 
  OrderControllers.updateOrderStatus
);

// User-specific routes
router.get('/my/orders', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  orderQueryValidation, 
  OrderControllers.getMyOrders
);
router.get('/my/analytics', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrderControllers.getMyAnalytics
);

export const OrderRoutes = router;