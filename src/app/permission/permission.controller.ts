import { Request, Response } from 'express';
import { PermissionService } from './permission.service';
import { PermissionValidation } from './permission.validation';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import ClientModel from '../user/client/client.model';

// ===== PERMISSION CONTROLLERS =====

export const createPermission = async (req: Request, res: Response) => {
  try {
    const parsedData = await PermissionValidation.permissionCreateSchema.parseAsync({
      body: req.body,
    });

    const result = await PermissionService.createPermission(parsedData.body);

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const result = await PermissionService.getAllPermissions();
    
    res.status(200).json({
      success: true,
      message: 'Permissions fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid permission ID format',
        data: null,
      });
    }
    
    const result = await PermissionService.getPermissionById(trimmedId);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Permission fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Permission not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid permission ID format',
        data: null,
      });
    }
    
    const parsedData = await PermissionValidation.permissionUpdateSchema.parseAsync({
      body: req.body,
    });
    
    const result = await PermissionService.updatePermission(trimmedId, parsedData.body);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Permission updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Permission not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid permission ID format',
        data: null,
      });
    }
    
    const result = await PermissionService.deletePermission(trimmedId);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Permission deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Permission not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== ROLE CONTROLLERS =====

export const createRole = async (req: Request, res: Response) => {
  try {
    const parsedData = await PermissionValidation.roleCreateSchema.parseAsync({
      body: req.body,
    });

    // Convert string IDs to ObjectIds
    const roleData = {
      ...parsedData.body,
      permissions: parsedData.body.permissions ? parsedData.body.permissions.map(id => new mongoose.Types.ObjectId(id)) : []
    };

    const result = await PermissionService.createRole(roleData);

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const result = await PermissionService.getAllRoles();
    
    res.status(200).json({
      success: true,
      message: 'Roles fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format',
        data: null,
      });
    }
    
    const result = await PermissionService.getRoleById(trimmedId);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Role fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Role not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format',
        data: null,
      });
    }
    
    const parsedData = await PermissionValidation.roleUpdateSchema.parseAsync({
      body: req.body,
    });
    
    // Convert string IDs to ObjectIds
    const roleData = {
      ...parsedData.body,
      permissions: parsedData.body.permissions ? parsedData.body.permissions.map(id => new mongoose.Types.ObjectId(id)) : undefined
    };
    
    const result = await PermissionService.updateRole(trimmedId, roleData);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Role not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format',
        data: null,
      });
    }
    
    const result = await PermissionService.deleteRole(trimmedId);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Role not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const addPermissionsToRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format',
        data: null,
      });
    }
    
    const parsedData = await PermissionValidation.roleAddPermissionsSchema.parseAsync({
      body: req.body,
    });
    
    const result = await PermissionService.addPermissionsToRole(trimmedId, parsedData.body.permissionIds);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Permissions added to role successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Role not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const removePermissionsFromRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format',
        data: null,
      });
    }
    
    const parsedData = await PermissionValidation.roleRemovePermissionsSchema.parseAsync({
      body: req.body,
    });
    
    const result = await PermissionService.removePermissionsFromRole(trimmedId, parsedData.body.permissionIds);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Permissions removed from role successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Role not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== USER ROLE CONTROLLERS =====

export const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const parsedData = await PermissionValidation.userRoleAssignSchema.parseAsync({
      body: req.body,
    });

    // Get the user who is assigning the role (from auth middleware)
    const assignedBy = (req as any).user?.userId;
    if (!assignedBy) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated',
      });
    }

    const result = await PermissionService.assignRoleToUser(
      parsedData.body.userId,
      parsedData.body.roleId,
      assignedBy
    );

    res.status(201).json({
      success: true,
      message: 'Role assigned to user successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const trimmedUserId = userId.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        data: null,
      });
    }
    
    const result = await PermissionService.getUserRoles(trimmedUserId);
    
    res.status(200).json({
      success: true,
      message: 'User roles fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const removeRoleFromUser = async (req: Request, res: Response) => {
  try {
    const parsedData = await PermissionValidation.userRoleRemoveSchema.parseAsync({
      body: req.body,
    });
    
    const result = await PermissionService.removeRoleFromUser(
      parsedData.body.userId,
      parsedData.body.roleId
    );
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Role removed from user successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User role assignment not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== PERMISSION CHECK CONTROLLERS =====

export const checkUserPermission = async (req: Request, res: Response) => {
  try {
    const parsedData = await PermissionValidation.permissionCheckSchema.parseAsync({
      body: req.body,
    });
    
    const result = await PermissionService.checkUserPermission(
      parsedData.body.userId,
      parsedData.body.resource,
      parsedData.body.action
    );
    
    res.status(200).json({
      success: true,
      message: 'Permission check completed',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getUserPermissions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const trimmedUserId = userId.trim();
    
    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        data: null,
      });
    }
    
    const result = await PermissionService.getUserPermissions(trimmedUserId);
    
    res.status(200).json({
      success: true,
      message: 'User permissions fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getCurrentUserPermissions = async (req: any, res: Response) => {
  try {
    // Try to get userId from JWT payload
    let userId = (req as any).user?.userId;
 
    // If userId is not available, try to get it from email
    if (!userId && (req as any).user?.email) {
      const client = await ClientModel.findOne({ email: (req as any).user.email }).select('_id');
      if (client?._id) {
        userId = String(client._id);
      }
    }
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated',
      });
    }
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }
    
    const result = await PermissionService.getUserPermissions(userId);
    
    res.status(200).json({
      success: true,
      message: 'Current user permissions fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const checkCurrentUserPermission = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated',
      });
    }
    
    const parsedData = await PermissionValidation.permissionCheckSchema.parseAsync({
      body: req.body,
    });
    
    const result = await PermissionService.checkUserPermission(
      userId,
      parsedData.body.resource,
      parsedData.body.action
    );
    
    res.status(200).json({
      success: true,
      message: 'Permission check completed',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// ===== UTILITY CONTROLLERS =====

export const testPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await PermissionService.getAllPermissions();
    const roles = await PermissionService.getAllRoles();
    
    res.status(200).json({
      success: true,
      message: 'Test endpoint - permissions and roles fetched successfully',
      data: {
        permissions: permissions.length,
        roles: roles.length,
        permissionsList: permissions,
        rolesList: roles
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const initializeDefaultData = async (req: Request, res: Response) => {
  try {
    await PermissionService.createDefaultPermissions();
    await PermissionService.createDefaultRoles();
    
    res.status(200).json({
      success: true,
      message: 'Default permissions and roles initialized successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Export all controllers
export const PermissionControllers = {
  // Permission controllers
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  
  // Role controllers
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  addPermissionsToRole,
  removePermissionsFromRole,
  
  // User role controllers
  assignRoleToUser,
  getUserRoles,
  removeRoleFromUser,
  
  // Permission check controllers
  checkUserPermission,
  getUserPermissions,
  getCurrentUserPermissions,
  checkCurrentUserPermission,
  
  // Utility controllers
  testPermissions,
  initializeDefaultData
};
