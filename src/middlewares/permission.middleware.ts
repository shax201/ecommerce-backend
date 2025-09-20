import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { PermissionService } from '../app/permission/permission.service';
import { PermissionResource, PermissionAction } from '../app/permission/permission.interface';

export interface PermissionRequest extends AuthRequest {
  requiredPermission?: {
    resource: PermissionResource;
    action: PermissionAction;
  };
}

/**
 * Middleware to check if user has specific permission
 * @param resource - The resource to check permission for
 * @param action - The action to check permission for
 */
export const requirePermission = (resource: PermissionResource, action: PermissionAction) => {
  return async (req: PermissionRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Store the required permission in request for potential use in controllers
      req.requiredPermission = { resource, action };

      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: User not authenticated' 
        });
        return;
      }

      // Check if user has the required permission
      const hasPermission = await PermissionService.checkUserPermission(
        req.user.userId,
        resource,
        action
      );

      console.log('resource', resource);

      if (!hasPermission.hasPermission) {
        res.status(403).json({
          success: false,
          message: `Forbidden: ${hasPermission.reason || 'Insufficient permissions'}`,
          requiredPermission: `${resource}:${action}`
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while checking permissions',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param permissions - Array of permission objects with resource and action
 */
export const requireAnyPermission = (permissions: Array<{ resource: PermissionResource; action: PermissionAction }>) => {
  return async (req: PermissionRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: User not authenticated' 
        });
        return;
      }

      // Check if user has any of the required permissions
      const permissionChecks = await Promise.all(
        permissions.map(permission => 
          PermissionService.checkUserPermission(
            req.user!.userId!,
            permission.resource,
            permission.action
          )
        )
      );

      const hasAnyPermission = permissionChecks.some((check: any) => check.hasPermission);

      if (!hasAnyPermission) {
        const requiredPermissions = permissions.map(p => `${p.resource}:${p.action}`).join(', ');
        res.status(403).json({
          success: false,
          message: `Forbidden: Insufficient permissions. Required: ${requiredPermissions}`
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while checking permissions',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
};

/**
 * Middleware to check if user has all of the specified permissions
 * @param permissions - Array of permission objects with resource and action
 */
export const requireAllPermissions = (permissions: Array<{ resource: PermissionResource; action: PermissionAction }>) => {
  return async (req: PermissionRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: User not authenticated' 
        });
        return;
      }

      // Check if user has all of the required permissions
      const permissionChecks = await Promise.all(
        permissions.map(permission => 
          PermissionService.checkUserPermission(
            req.user!.userId!,
            permission.resource,
            permission.action
          )
        )
      );

      const hasAllPermissions = permissionChecks.every((check: any) => check.hasPermission);

      if (!hasAllPermissions) {
        const missingPermissions = permissionChecks
          .map((check: any, index: number) => !check.hasPermission ? `${permissions[index].resource}:${permissions[index].action}` : null)
          .filter(Boolean);
        
        res.status(403).json({
          success: false,
          message: `Forbidden: Missing permissions: ${missingPermissions.join(', ')}`
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while checking permissions',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
};

/**
 * Middleware to check if user is admin (has admin role)
 */
export const requireAdmin = async (req: PermissionRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: User not authenticated' 
      });
      return;
    }

    // Check if user is admin by checking if they have admin role or exist in admin collection
    const isAdmin = await PermissionService.isUserAdmin(req.user.userId);
    
    // If not found in admin collection, check if they have admin role
    if (!isAdmin) {
      const hasAdminRole = await PermissionService.hasUserRole(req.user.userId, 'admin');
      if (!hasAdminRole) {
        res.status(403).json({
          success: false,
          message: 'Forbidden: Admin access required'
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Admin check middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking admin status',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
