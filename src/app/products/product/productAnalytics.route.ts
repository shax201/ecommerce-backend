import express from 'express';
import { ProductAnalyticsControllers } from './productAnalytics.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { param, query, body } from 'express-validator';

const router = express.Router();

// Validation middleware
const productIdValidation = [
  param('productId').isMongoId().withMessage('Invalid product ID format'),
];

const analyticsQueryValidation = [
  query('startDate').optional().isISO8601().withMessage('Start date must be in ISO 8601 format'),
  query('endDate').optional().isISO8601().withMessage('End date must be in ISO 8601 format'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('period').optional().isIn(['week', 'month', 'all']).withMessage('Period must be week, month, or all'),
];

const ratingValidation = [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

const purchaseValidation = [
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

// Public routes (no authentication required)
router.get('/analytics', analyticsQueryValidation, ProductAnalyticsControllers.getProductAnalytics);
router.get('/performance', analyticsQueryValidation, ProductAnalyticsControllers.getProductPerformanceMetrics);
router.get('/inventory-report', ProductAnalyticsControllers.getInventoryReport);
router.get('/top-selling', analyticsQueryValidation, ProductAnalyticsControllers.getTopSellingProducts);
router.get('/low-stock', analyticsQueryValidation, ProductAnalyticsControllers.getLowStockProducts);
router.get('/recommendations', analyticsQueryValidation, ProductAnalyticsControllers.getProductRecommendations);
router.get('/:productId/related', productIdValidation, analyticsQueryValidation, ProductAnalyticsControllers.getRelatedProducts);

// Tracking routes (public but should be rate limited)
router.post('/:productId/view', productIdValidation, ProductAnalyticsControllers.trackProductView);
router.post('/:productId/purchase', productIdValidation, purchaseValidation, ProductAnalyticsControllers.trackProductPurchase);
router.post('/:productId/rating', productIdValidation, ratingValidation, ProductAnalyticsControllers.updateProductRating);

export const ProductAnalyticsRoutes = router;
