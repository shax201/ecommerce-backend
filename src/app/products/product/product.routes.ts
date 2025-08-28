import express from 'express';
import { ProductControllers } from './product.controller';
import { authMiddleware, authorizeRoles } from '../../../middlewares/auth.middleware';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', ProductControllers.getProducts);
router.get('/top-selling', ProductControllers.getTopSellingProducts);
router.get('/category/:categoryId', ProductControllers.getProductsByCategory);
router.get('/:id', ProductControllers.getSingleProduct);
// Protected routes (only admin can access)
router.post('/create',
    //  authMiddleware, 
    //  authorizeRoles(['admin']), 
     ProductControllers.createProduct);

router.post('/seed_products',
    //  authMiddleware, 
    //  authorizeRoles(['admin']), 
     ProductControllers.seedProducts);

router.put('/update/:id', 
    //  authMiddleware, 
    //  authorizeRoles(['admin']), 
     ProductControllers.updateProduct);
router.delete('/delete/:id', 
    //  authMiddleware, 
    //  authorizeRoles(['admin']),
      ProductControllers.deleteProduct);

router.post('/purchase',
    //  authMiddleware, 
     ProductControllers.purchaseProduct);

export const ProductRoutes = router;