import express from 'express';
import { ProductControllers } from './product.controller';
import { ProductAnalyticsRoutes } from './productAnalytics.route';
import { ProductReviewRoutes } from './productReview.route';
import { ProductWishlistRoutes } from './productWishlist.route';
import { ProductImportExportRoutes } from './productImportExport.route';
import { authMiddleware, authorizeRoles } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', ProductControllers.getProducts);
router.get('/top-selling', ProductControllers.getTopSellingProducts);
router.get('/category/:categoryId', ProductControllers.getProductsByCategory);
router.get('/:id', ProductControllers.getSingleProduct);

// Protected routes with permission-based access
router.post('/create',
    authMiddleware, 
    requirePermission('products', 'create'),
    ProductControllers.createProduct);

router.post('/seed_products',
    authMiddleware, 
    requirePermission('products', 'create'),
    ProductControllers.seedProducts);

router.put('/update/:id', 
    authMiddleware, 
    requirePermission('products', 'update'),
    ProductControllers.updateProduct);

router.delete('/delete/:id', 
    authMiddleware, 
    requirePermission('products', 'delete'),
    ProductControllers.deleteProduct);

router.post('/purchase',
    authMiddleware, 
    ProductControllers.purchaseProduct);

router.post('/validate-coupon',
    authMiddleware, 
    ProductControllers.validateCoupon);

// Mount sub-routes
router.use('/analytics', ProductAnalyticsRoutes);
router.use('/reviews', ProductReviewRoutes);
router.use('/wishlist', ProductWishlistRoutes);
router.use('/import-export', ProductImportExportRoutes);

export const ProductRoutes = router;