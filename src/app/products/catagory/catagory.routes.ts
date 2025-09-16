import express from 'express';
import { CatagoryControllers } from './catagory.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';

const router = express.Router();

// Public routes (for frontend display)
router.get('/', CatagoryControllers.getCatagory);
router.get('/:id', CatagoryControllers.getSingleCatagory);

// Protected routes (Admin only)
router.post('/create', 
  authMiddleware, 
  requirePermission('categories', 'create'), 
  CatagoryControllers.createCatagory
);

router.put('/:id', 
  authMiddleware, 
  requirePermission('categories', 'update'), 
  CatagoryControllers.updateCatagory
);

router.delete('/:id', 
  authMiddleware, 
  requirePermission('categories', 'delete'), 
  CatagoryControllers.deleteCatagory
);

export const CatagoryRoutes = router;