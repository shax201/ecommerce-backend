import { Router } from 'express';
import { PermissionControllers } from './permission.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth.middleware';
import { requirePermission, requireAdmin } from '../../middlewares/permission.middleware';

const router = Router();

// ===== PERMISSION ROUTES =====

// Create permission (Admin only)
router.post(
  '/permissions',
  authMiddleware,
  requireAdmin,
  PermissionControllers.createPermission
);

// Get all permissions (Admin only)
router.get(
  '/permissions',
  authMiddleware,
  PermissionControllers.getAllPermissions
);

// Get permission by ID (Admin only)
router.get(
  '/permissions/:id',
  authMiddleware,
  requireAdmin,
  PermissionControllers.getPermissionById
);

// Update permission (Admin only)
router.put(
  '/permissions/:id',
  authMiddleware,
  requireAdmin,
  PermissionControllers.updatePermission
);

// Delete permission (Admin only)
router.delete(
  '/permissions/:id',
  authMiddleware,
  requireAdmin,
  PermissionControllers.deletePermission
);

// ===== ROLE ROUTES =====

// Create role (Admin only)
router.post(
  '/roles',
  authMiddleware,
  requireAdmin,
  PermissionControllers.createRole
);

// Get all roles (Admin only)
router.get(
  '/roles',
  authMiddleware,
  PermissionControllers.getAllRoles
);

// Get role by ID (Admin only)
router.get(
  '/roles/:id',
  authMiddleware,
  requireAdmin,
  PermissionControllers.getRoleById
);

// Update role (Admin only)
router.put(
  '/roles/:id',
  authMiddleware,
  requireAdmin,
  PermissionControllers.updateRole
);

// Delete role (Admin only)
router.delete(
  '/roles/:id',
  authMiddleware,
  requireAdmin,
  PermissionControllers.deleteRole
);

// Add permissions to role (Admin only)
router.post(
  '/roles/:id/permissions',
  authMiddleware,
  requireAdmin,
  PermissionControllers.addPermissionsToRole
);

// Remove permissions from role (Admin only)
router.delete(
  '/roles/:id/permissions',
  authMiddleware,
  requireAdmin,
  PermissionControllers.removePermissionsFromRole
);

// ===== USER ROLE ROUTES =====

// Assign role to user (Admin only)
router.post(
  '/user-roles/assign',
  authMiddleware,
  requireAdmin,
  PermissionControllers.assignRoleToUser
);

// Get user roles (Admin only)
router.get(
  '/user-roles/:userId',
  authMiddleware,
  requireAdmin,
  PermissionControllers.getUserRoles
);

// Remove role from user (Admin only)
router.delete(
  '/user-roles/remove',
  authMiddleware,
  requireAdmin,
  PermissionControllers.removeRoleFromUser
);

// ===== PERMISSION CHECK ROUTES =====

// Check user permission (Admin only)
router.post(
  '/check-permission',
  authMiddleware,
  requireAdmin,
  PermissionControllers.checkUserPermission
);

// Get user permissions (Admin only)
router.get(
  '/user-permissions/:userId',
  authMiddleware,
  requireAdmin,
  PermissionControllers.getUserPermissions
);

// Get current user permissions (for authenticated users)
router.get(
  '/my-permissions',
  authMiddleware,
  PermissionControllers.getCurrentUserPermissions
);

// Check current user permission (for authenticated users)
router.post(
  '/check-my-permission',
  authMiddleware,
  PermissionControllers.checkCurrentUserPermission
);

// ===== UTILITY ROUTES =====

// Test endpoint to check if permissions exist (no auth required for testing)
router.get(
  '/test-permissions',
  PermissionControllers.testPermissions
);

// Initialize default data (Admin only)
router.post(
  '/initialize',
  authMiddleware,
  requireAdmin,
  PermissionControllers.initializeDefaultData
);

export { router as PermissionRoutes };
