import express from 'express';
import { OrderTrackingControllers } from './orderTracking.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { param, query, body } from 'express-validator';

const router = express.Router();

// Validation middleware
const orderIdValidation = [
  param('id').isMongoId().withMessage('Invalid order ID format'),
];

const statusValidation = [
  param('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

const bulkTrackingValidation = [
  body('orderIds')
    .isArray({ min: 1 })
    .withMessage('Order IDs must be a non-empty array'),
  body('orderIds.*')
    .isMongoId()
    .withMessage('Invalid order ID format'),
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
];

// Public routes (for customers to track their orders)
router.get('/track/:id', orderIdValidation, OrderTrackingControllers.getOrderTracking);
router.get('/status/:status', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  statusValidation, 
  paginationValidation, 
  OrderTrackingControllers.getOrdersByStatus
);
router.get('/stats', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrderTrackingControllers.getTrackingStats
);

// Protected routes
router.post('/bulk', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  bulkTrackingValidation, 
  OrderTrackingControllers.getBulkTracking
);
router.patch('/:id/status', 
  authMiddleware, 
  requirePermission('orders', 'update'), 
  orderIdValidation, 
  updateStatusValidation, 
  OrderTrackingControllers.updateOrderStatus
);

export const OrderTrackingRoutes = router;
