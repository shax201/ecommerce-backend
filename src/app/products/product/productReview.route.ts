import express from 'express';
import { ProductReviewControllers } from './productReview.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';
import { param, query, body } from 'express-validator';

const router = express.Router();

// Validation middleware
const reviewIdValidation = [
  param('reviewId').isMongoId().withMessage('Invalid review ID format'),
];

const productIdValidation = [
  param('productId').isMongoId().withMessage('Invalid product ID format'),
];

const createReviewValidation = [
  body('productId').isMongoId().withMessage('Invalid product ID format'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('comment').isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isURL().withMessage('Each image must be a valid URL'),
];

const updateReviewValidation = [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('comment').optional().isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isURL().withMessage('Each image must be a valid URL'),
];

const reviewQueryValidation = [
  query('productId').optional().isMongoId().withMessage('Invalid product ID format'),
  query('userId').optional().isMongoId().withMessage('Invalid user ID format'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected'),
  query('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['createdAt', 'rating', 'helpful']).withMessage('Sort by must be createdAt, rating, or helpful'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];

const helpfulValidation = [
  body('helpful').optional().isBoolean().withMessage('Helpful must be a boolean'),
];

const statusValidation = [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected'),
];

const adminResponseValidation = [
  body('response').isLength({ min: 1, max: 1000 }).withMessage('Response must be between 1 and 1000 characters'),
];

// Public routes
router.get('/', reviewQueryValidation, ProductReviewControllers.getReviews);
router.get('/recent', ProductReviewControllers.getRecentReviews);
router.get('/top-rated', ProductReviewControllers.getTopRatedProducts);
router.get('/stats/:productId', productIdValidation, ProductReviewControllers.getReviewStats);
router.get('/:reviewId', reviewIdValidation, ProductReviewControllers.getReviewById);

// User routes (require authentication)
router.post('/', 
  authMiddleware, 
  requirePermission('products', 'create'), 
  createReviewValidation, 
  ProductReviewControllers.createReview
);
router.put('/:reviewId', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  reviewIdValidation, 
  updateReviewValidation, 
  ProductReviewControllers.updateReview
);
router.delete('/:reviewId', 
  authMiddleware, 
  requirePermission('products', 'delete'), 
  reviewIdValidation, 
  ProductReviewControllers.deleteReview
);
router.post('/:reviewId/helpful', 
  authMiddleware, 
  reviewIdValidation, 
  helpfulValidation, 
  ProductReviewControllers.markHelpful
);

// Admin routes (require authentication and admin permissions)
router.patch('/:reviewId/status', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  reviewIdValidation, 
  statusValidation, 
  ProductReviewControllers.updateReviewStatus
);
router.post('/:reviewId/response', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  reviewIdValidation, 
  adminResponseValidation, 
  ProductReviewControllers.addAdminResponse
);

export const ProductReviewRoutes = router;
