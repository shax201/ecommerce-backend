import express from 'express';
import { OrderAnalyticsControllers } from './orderAnalytics.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { query } from 'express-validator';

const router = express.Router();

// Validation middleware
const dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format'),
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Period must be daily, weekly, or monthly'),
  query('groupBy')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Group by must be daily, weekly, or monthly'),
];

// All analytics routes require authentication and orders read permission
router.get('/overview', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  dateRangeValidation, 
  OrderAnalyticsControllers.getOrderAnalytics
);
router.get('/trends', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  dateRangeValidation, 
  OrderAnalyticsControllers.getSalesTrends
);
router.get('/customers', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrderAnalyticsControllers.getCustomerAnalytics
);
router.get('/products', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  OrderAnalyticsControllers.getProductAnalytics
);
router.get('/revenue', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  dateRangeValidation, 
  OrderAnalyticsControllers.getRevenueReport
);
router.get('/dashboard', 
  authMiddleware, 
  requirePermission('orders', 'read'), 
  dateRangeValidation, 
  OrderAnalyticsControllers.getDashboardData
);

export const OrderAnalyticsRoutes = router;
