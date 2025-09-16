import express from 'express';
import { UserManagementControllers } from './userManagement.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';

const router = express.Router();

// Public routes
router.post('/login', UserManagementControllers.loginUser);

// Protected routes - require authentication and permissions

// User CRUD operations
router.post('/', 
  authMiddleware, 
  requirePermission('users', 'create'), 
  UserManagementControllers.createUser
);

router.get('/', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  UserManagementControllers.getAllUsers
);

router.get('/search', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  UserManagementControllers.searchUsers
);

router.get('/stats', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  UserManagementControllers.getUserStats
);

router.get('/:id', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  UserManagementControllers.getUserById
);

router.put('/:id', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  UserManagementControllers.updateUser
);

router.delete('/:id', 
  authMiddleware, 
  requirePermission('users', 'delete'), 
  UserManagementControllers.deleteUser
);

// User status management
router.put('/:id/status', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  UserManagementControllers.updateUserStatus
);

// User role management
router.put('/:id/role', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  UserManagementControllers.updateUserRole
);

// Password management
router.put('/:id/password', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  UserManagementControllers.changePassword
);

router.put('/:id/reset-password', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  UserManagementControllers.resetPassword
);

// Bulk operations
router.post('/bulk', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  UserManagementControllers.bulkOperation
);

export const UserManagementRoutes = router;
