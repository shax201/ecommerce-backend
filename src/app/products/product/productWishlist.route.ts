import express from 'express';
import { ProductWishlistControllers } from './productWishlist.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';
import { param, query, body } from 'express-validator';

const router = express.Router();

// Validation middleware
const productIdValidation = [
  param('productId').isMongoId().withMessage('Invalid product ID format'),
];

const priorityValidation = [
  param('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

const addToWishlistValidation = [
  body('productId').isMongoId().withMessage('Invalid product ID format'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

const updateWishlistValidation = [
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

const wishlistQueryValidation = [
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['addedAt', 'priority', 'productTitle']).withMessage('Sort by must be addedAt, priority, or productTitle'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];

// All routes require authentication and product permissions
router.post('/', 
  authMiddleware, 
  requirePermission('products', 'create'), 
  addToWishlistValidation, 
  ProductWishlistControllers.addToWishlist
);
router.get('/', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  wishlistQueryValidation, 
  ProductWishlistControllers.getWishlist
);
router.get('/stats', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  ProductWishlistControllers.getWishlistStats
);
router.get('/recommendations', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  ProductWishlistControllers.getWishlistRecommendations
);
router.get('/priority/:priority', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  priorityValidation, 
  ProductWishlistControllers.getWishlistByPriority
);
router.get('/check/:productId', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  productIdValidation, 
  ProductWishlistControllers.isInWishlist
);
router.put('/:productId', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  productIdValidation, 
  updateWishlistValidation, 
  ProductWishlistControllers.updateWishlistItem
);
router.delete('/:productId', 
  authMiddleware, 
  requirePermission('products', 'delete'), 
  productIdValidation, 
  ProductWishlistControllers.removeFromWishlist
);
router.post('/:productId/move-to-cart', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  productIdValidation, 
  ProductWishlistControllers.moveToCart
);
router.delete('/', 
  authMiddleware, 
  requirePermission('products', 'delete'), 
  ProductWishlistControllers.clearWishlist
);

export const ProductWishlistRoutes = router;
