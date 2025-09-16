import express from 'express';
import { ColorControllers, SizeControllers } from './attribute.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';

const router = express.Router();

// Color routes
router.get('/colors', ColorControllers.getColors); // Public route
router.get('/colors/:id', ColorControllers.getSingleColor); // Public route
router.post('/colors/create', 
  authMiddleware, 
  requirePermission('products', 'create'), 
  ColorControllers.createColor
);
router.put('/colors/:id', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  ColorControllers.updateColor
);
router.delete('/colors/:id', 
  authMiddleware, 
  requirePermission('products', 'delete'), 
  ColorControllers.deleteColor
);

// Size routes
router.get('/sizes', SizeControllers.getSizes); // Public route
router.get('/sizes/:id', SizeControllers.getSingleSize); // Public route
router.post('/sizes/create', 
  authMiddleware, 
  requirePermission('products', 'create'), 
  SizeControllers.createSize
);
router.put('/sizes/:id', 
  authMiddleware, 
  requirePermission('products', 'update'), 
  SizeControllers.updateSize
);
router.delete('/sizes/:id', 
  authMiddleware, 
  requirePermission('products', 'delete'), 
  SizeControllers.deleteSize
);

export const AttributeRoutes = router;