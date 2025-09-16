import express from 'express';
import * as OrdersController from './orders.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { 
  createOrderValidation, 
  updateOrderValidation, 
  orderQueryValidation, 
  orderIdValidation, 
  updateOrderStatusValidation 
} from './order.validation';

const router = express.Router();

// ===== ADMIN ROUTES (Require orders permissions) =====
router.get('/', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrdersController.getAllOrders
);

router.get('/analytics', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrdersController.getOrderAnalytics
);

// ===== PROTECTED ROUTES (Authenticated users) =====
router.post('/', 
  authMiddleware, 
  requirePermission('orders', 'create'), 
  createOrderValidation, 
  OrdersController.createOrder
);

router.get('/user', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  orderQueryValidation, 
  OrdersController.getUserOrders
);

router.get('/user/:userId', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  orderQueryValidation, 
  OrdersController.getUserOrders
);

router.get('/:id', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  orderIdValidation, 
  OrdersController.getOrderById
);

router.put('/:id', 
  authMiddleware, 
  requirePermission('orders', 'update'), 
  updateOrderValidation, 
  OrdersController.updateOrder
);

router.patch('/:id/status', 
  authMiddleware, 
  requirePermission('orders', 'update'), 
  updateOrderStatusValidation, 
  OrdersController.updateOrderStatus
);

router.delete('/:id', 
  authMiddleware, 
  requirePermission('orders', 'delete'), 
  orderIdValidation, 
  OrdersController.deleteOrder
);

router.get('/:id/tracking', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  orderIdValidation, 
  OrdersController.getOrderTracking
);

export const OrdersRoutes = router;
