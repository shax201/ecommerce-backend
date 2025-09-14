import express from 'express';
import { ProductWishlistControllers } from './productWishlist.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
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

// All routes require authentication
router.post('/', authMiddleware, addToWishlistValidation, ProductWishlistControllers.addToWishlist);
router.get('/', authMiddleware, wishlistQueryValidation, ProductWishlistControllers.getWishlist);
router.get('/stats', authMiddleware, ProductWishlistControllers.getWishlistStats);
router.get('/recommendations', authMiddleware, ProductWishlistControllers.getWishlistRecommendations);
router.get('/priority/:priority', authMiddleware, priorityValidation, ProductWishlistControllers.getWishlistByPriority);
router.get('/check/:productId', authMiddleware, productIdValidation, ProductWishlistControllers.isInWishlist);
router.put('/:productId', authMiddleware, productIdValidation, updateWishlistValidation, ProductWishlistControllers.updateWishlistItem);
router.delete('/:productId', authMiddleware, productIdValidation, ProductWishlistControllers.removeFromWishlist);
router.post('/:productId/move-to-cart', authMiddleware, productIdValidation, ProductWishlistControllers.moveToCart);
router.delete('/', authMiddleware, ProductWishlistControllers.clearWishlist);

export const ProductWishlistRoutes = router;
