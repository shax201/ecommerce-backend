import express from 'express';
import { AdminControllers } from './admin.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';

const router = express.Router();

// Public routes
router.post('/', AdminControllers.createAdmin);
router.post('/login', AdminControllers.loginAdmin);

// Protected routes - require authentication and permissions
router.get('/', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  AdminControllers.getAllAdmin
);

router.get('/:id', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  AdminControllers.getAdminById
);

router.put('/:id', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  AdminControllers.updateAdmin
);

router.delete('/:id', 
  authMiddleware, 
  requirePermission('users', 'delete'), 
  AdminControllers.deleteAdmin
);

export const AdminRoutes = router; 