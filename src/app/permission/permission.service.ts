import { PermissionModel, RoleModel, UserRoleModel } from './permission.model';
import { IPermission, IRole, IUserRole, IPermissionCheck, IPermissionResult, PermissionResource, PermissionAction } from './permission.interface';
import AdminModel from '../user/admin/admin.model';
import ClientModel from '../user/client/client.model';
import { UserManagementModel } from '../user/userManagement/userManagement.model';
import mongoose from 'mongoose';

export class PermissionService {
  // ===== PERMISSION METHODS =====
  
  /**
   * Create a new permission
   */
  static async createPermission(permissionData: Omit<IPermission, '_id' | 'createdAt' | 'updatedAt'>): Promise<IPermission> {
    const permission = new PermissionModel(permissionData);
    return await permission.save();
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions(): Promise<IPermission[]> {
    return await PermissionModel.find().sort({ resource: 1, action: 1 });
  }

  /**
   * Get permission by ID
   */
  static async getPermissionById(permissionId: string): Promise<IPermission | null> {
    if (!mongoose.Types.ObjectId.isValid(permissionId)) {
      throw new Error('Invalid permission ID format');
    }
    return await PermissionModel.findById(permissionId);
  }

  /**
   * Update permission
   */
  static async updatePermission(permissionId: string, updateData: Partial<IPermission>): Promise<IPermission | null> {
    if (!mongoose.Types.ObjectId.isValid(permissionId)) {
      throw new Error('Invalid permission ID format');
    }
    return await PermissionModel.findByIdAndUpdate(permissionId, updateData, { new: true });
  }

  /**
   * Delete permission
   */
  static async deletePermission(permissionId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(permissionId)) {
      throw new Error('Invalid permission ID format');
    }
    const result = await PermissionModel.findByIdAndDelete(permissionId);
    return !!result;
  }

  // ===== ROLE METHODS =====

  /**
   * Create a new role
   */
  static async createRole(roleData: Omit<IRole, '_id' | 'createdAt' | 'updatedAt'>): Promise<IRole> {
    const role = new RoleModel(roleData);
    return await role.save();
  }

  /**
   * Get all roles
   */
  static async getAllRoles(): Promise<IRole[]> {
    return await RoleModel.find({ isActive: true }).populate('permissions');
  }

  /**
   * Get role by ID
   */
  static async getRoleById(roleId: string): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new Error('Invalid role ID format');
    }
    return await RoleModel.findById(roleId).populate('permissions');
  }

  /**
   * Update role
   */
  static async updateRole(roleId: string, updateData: Partial<IRole>): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new Error('Invalid role ID format');
    }
    return await RoleModel.findByIdAndUpdate(roleId, updateData, { new: true }).populate('permissions');
  }

  /**
   * Delete role (soft delete)
   */
  static async deleteRole(roleId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new Error('Invalid role ID format');
    }
    const result = await RoleModel.findByIdAndUpdate(roleId, { isActive: false }, { new: true });
    return !!result;
  }

  /**
   * Add permissions to role
   */
  static async addPermissionsToRole(roleId: string, permissionIds: string[]): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new Error('Invalid role ID format');
    }
    
    // Validate permission IDs
    const validPermissionIds = permissionIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validPermissionIds.length === 0) {
      throw new Error('No valid permission IDs provided');
    }

    return await RoleModel.findByIdAndUpdate(
      roleId,
      { $addToSet: { permissions: { $each: validPermissionIds } } },
      { new: true }
    ).populate('permissions');
  }

  /**
   * Remove permissions from role
   */
  static async removePermissionsFromRole(roleId: string, permissionIds: string[]): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new Error('Invalid role ID format');
    }

    return await RoleModel.findByIdAndUpdate(
      roleId,
      { $pull: { permissions: { $in: permissionIds } } },
      { new: true }
    ).populate('permissions');
  }

  // ===== USER ROLE METHODS =====

  /**
   * Assign role to user
   */
  static async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<IUserRole> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId) || !mongoose.Types.ObjectId.isValid(assignedBy)) {
      throw new Error('Invalid ID format');
    }

    // Check if user exists (either admin, client, or in user management)
    const admin = await AdminModel.findById(userId);
    const client = await ClientModel.findById(userId);
    const userManagement = await UserManagementModel.findById(userId);
    
    if (!admin && !client && !userManagement) {
      throw new Error('User not found');
    }

    // Check if role exists
    const role = await RoleModel.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Deactivate any existing active roles for this user
    await UserRoleModel.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    // Create new user role assignment
    const userRole = new UserRoleModel({
      userId,
      roleId,
      assignedBy,
      isActive: true
    });

    const savedUserRole = await userRole.save();

    // Update the user's roles array if it's an admin user (legacy system)
    if (admin) {
      // Remove any existing roles and add the new one
      await AdminModel.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            roles: [roleId] // Replace all roles with just this one
          } 
        }
      );
    }
    
    // Note: UserManagementModel users don't need role array updates as they use the UserRoleModel

    return savedUserRole;
  }

  /**
   * Get user roles
   */
  static async getUserRoles(userId: string): Promise<IUserRole[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    return await UserRoleModel.find({ userId, isActive: true }).populate({
      path: 'roleId',
      model: 'Role'
    });
  }

  /**
   * Remove role from user
   */
  static async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)) {
      throw new Error('Invalid ID format');
    }

    const result = await UserRoleModel.updateOne(
      { userId, roleId, isActive: true },
      { isActive: false }
    );

    return result.modifiedCount > 0;
  }

  // ===== PERMISSION CHECK METHODS =====

  /**
   * Check if user has specific permission
   */
  static async checkUserPermission(
    userId: string, 
    resource: PermissionResource, 
    action: PermissionAction
  ): Promise<IPermissionResult> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { hasPermission: false, reason: 'Invalid user ID format' };
      }

      // Get user's active roles
      const userRoles = await UserRoleModel.find({ userId, isActive: true }).populate('roleId');
      
      if (userRoles.length === 0) {
        return { hasPermission: false, reason: 'User has no assigned roles' };
      }

      // Get all permissions for user's roles
      const roleIds = userRoles.map(ur => ur.roleId);
      const roles = await RoleModel.find({ 
        _id: { $in: roleIds }, 
        isActive: true 
      }).populate('permissions');

      // Check if any role has the required permission
      for (const role of roles) {
        const hasPermission = role.permissions.some((permission: any) => 
          permission.resource === resource && permission.action === action
        );
        
        if (hasPermission) {
          return { hasPermission: true };
        }
      }

      return { 
        hasPermission: false, 
        reason: `User does not have permission for ${resource}:${action}` 
      };
    } catch (error) {
      console.error('Error checking user permission:', error);
      return { 
        hasPermission: false, 
        reason: 'Error checking permissions' 
      };
    }
  }

  /**
   * Check if user is admin
   */
  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return false;
      }

      // Check if user exists in admin collection or user management
      const admin = await AdminModel.findById(userId);
      const userManagement = await UserManagementModel.findById(userId);
      return !!(admin || userManagement);
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Check if user has a specific role
   */
  static async hasUserRole(userId: string, roleName: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return false;
      }

      // Get user roles
      const userRoles = await UserRoleModel.find({ userId, isActive: true }).populate('roleId');
      
      if (userRoles.length === 0) {
        return false;
      }

      // Check if any of the user's roles match the role name
      const roleIds = userRoles.map(ur => ur.roleId);
      const roles = await RoleModel.find({ _id: { $in: roleIds }, isActive: true });
      
      return roles.some(role => role.name.toLowerCase() === roleName.toLowerCase());
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  /**
   * Get user permissions
   */
  static async getUserPermissions(userId: string): Promise<IPermission[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Get user's active roles
      const userRoles = await UserRoleModel.find({ userId, isActive: true }).populate('roleId');
      
      if (userRoles.length === 0) {
        return [];
      }

      // Get all permissions for user's roles
      const roleIds = userRoles.map(ur => ur.roleId);
      const roles = await RoleModel.find({ 
        _id: { $in: roleIds }, 
        isActive: true 
      }).populate('permissions');

      // Collect all unique permissions
      const allPermissions: IPermission[] = [];
      const permissionIds = new Set<string>();

      for (const role of roles) {
        for (const permission of role.permissions) {
          const perm = permission as any;
          if (!permissionIds.has(perm._id.toString())) {
            permissionIds.add(perm._id.toString());
            allPermissions.push(perm);
          }
        }
      }

      return allPermissions;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Create default permissions for the system
   */
  static async createDefaultPermissions(): Promise<void> {
    const defaultPermissions = [
      // User permissions
      { name: 'Create Users', resource: 'users' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new users' },
      { name: 'Read Users', resource: 'users' as PermissionResource, action: 'read' as PermissionAction, description: 'View user information' },
      { name: 'Update Users', resource: 'users' as PermissionResource, action: 'update' as PermissionAction, description: 'Update user information' },
      { name: 'Delete Users', resource: 'users' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete users' },

      // Product permissions
      { name: 'Create Products', resource: 'products' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new products' },
      { name: 'Read Products', resource: 'products' as PermissionResource, action: 'read' as PermissionAction, description: 'View products' },
      { name: 'Update Products', resource: 'products' as PermissionResource, action: 'update' as PermissionAction, description: 'Update product information' },
      { name: 'Delete Products', resource: 'products' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete products' },

      // Category permissions
      { name: 'Create Categories', resource: 'categories' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new categories' },
      { name: 'Read Categories', resource: 'categories' as PermissionResource, action: 'read' as PermissionAction, description: 'View categories' },
      { name: 'Update Categories', resource: 'categories' as PermissionResource, action: 'update' as PermissionAction, description: 'Update category information' },
      { name: 'Delete Categories', resource: 'categories' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete categories' },

      // Order permissions
      { name: 'Create Orders', resource: 'orders' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new orders' },
      { name: 'Read Orders', resource: 'orders' as PermissionResource, action: 'read' as PermissionAction, description: 'View orders' },
      { name: 'Update Orders', resource: 'orders' as PermissionResource, action: 'update' as PermissionAction, description: 'Update order information' },
      { name: 'Delete Orders', resource: 'orders' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete orders' },

      // Coupon permissions
      { name: 'Create Coupons', resource: 'coupons' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new coupons' },
      { name: 'Read Coupons', resource: 'coupons' as PermissionResource, action: 'read' as PermissionAction, description: 'View coupons' },
      { name: 'Update Coupons', resource: 'coupons' as PermissionResource, action: 'update' as PermissionAction, description: 'Update coupon information' },
      { name: 'Delete Coupons', resource: 'coupons' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete coupons' },

      // Content permissions
      { name: 'Create Content', resource: 'content' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new content' },
      { name: 'Read Content', resource: 'content' as PermissionResource, action: 'read' as PermissionAction, description: 'View content' },
      { name: 'Update Content', resource: 'content' as PermissionResource, action: 'update' as PermissionAction, description: 'Update content' },
      { name: 'Delete Content', resource: 'content' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete content' },

      // Report permissions
      { name: 'Create Reports', resource: 'reports' as PermissionResource, action: 'create' as PermissionAction, description: 'Create new reports' },
      { name: 'Read Reports', resource: 'reports' as PermissionResource, action: 'read' as PermissionAction, description: 'View reports' },
      { name: 'Update Reports', resource: 'reports' as PermissionResource, action: 'update' as PermissionAction, description: 'Update reports' },
      { name: 'Delete Reports', resource: 'reports' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete reports' },

      // Company settings permissions
      { name: 'Create Company Settings', resource: 'company-settings' as PermissionResource, action: 'create' as PermissionAction, description: 'Create company settings' },
      { name: 'Read Company Settings', resource: 'company-settings' as PermissionResource, action: 'read' as PermissionAction, description: 'View company settings' },
      { name: 'Update Company Settings', resource: 'company-settings' as PermissionResource, action: 'update' as PermissionAction, description: 'Update company settings' },
      { name: 'Delete Company Settings', resource: 'company-settings' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete company settings' },

      // Shipping address permissions
      { name: 'Create Shipping Addresses', resource: 'shipping-addresses' as PermissionResource, action: 'create' as PermissionAction, description: 'Create shipping addresses' },
      { name: 'Read Shipping Addresses', resource: 'shipping-addresses' as PermissionResource, action: 'read' as PermissionAction, description: 'View shipping addresses' },
      { name: 'Update Shipping Addresses', resource: 'shipping-addresses' as PermissionResource, action: 'update' as PermissionAction, description: 'Update shipping addresses' },
      { name: 'Delete Shipping Addresses', resource: 'shipping-addresses' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete shipping addresses' },

      // Courier permissions
      { name: 'Create Courier Credentials', resource: 'courier' as PermissionResource, action: 'create' as PermissionAction, description: 'Create courier credentials and configurations' },
      { name: 'Read Courier Credentials', resource: 'courier' as PermissionResource, action: 'read' as PermissionAction, description: 'View courier credentials and configurations' },
      { name: 'Update Courier Credentials', resource: 'courier' as PermissionResource, action: 'update' as PermissionAction, description: 'Update courier credentials and configurations' },
      { name: 'Delete Courier Credentials', resource: 'courier' as PermissionResource, action: 'delete' as PermissionAction, description: 'Delete courier credentials and configurations' },
      { name: 'Manage Courier Operations', resource: 'courier' as PermissionResource, action: 'manage' as PermissionAction, description: 'Manage courier operations and order integrations' },
    ];

    for (const permissionData of defaultPermissions) {
      const existingPermission = await PermissionModel.findOne({
        resource: permissionData.resource,
        action: permissionData.action
      });

      if (!existingPermission) {
        await PermissionModel.create(permissionData);
      }
    }
  }

  /**
   * Create default roles
   */
  static async createDefaultRoles(): Promise<void> {
    // Get all permissions
    const allPermissions = await PermissionModel.find();
    console.log('allPermissions', allPermissions.length)
    const permissionIds = allPermissions.map(p => p._id);

    console.log('permissionIds', permissionIds.length)
    const defaultRoles = [
      {
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        permissions: permissionIds,
        isActive: true
      },
      {
        name: 'Admin',
        description: 'Administrative access with most permissions',
        permissions: permissionIds.filter((_, index) => index < permissionIds.length - 4), // All except some sensitive permissions
        isActive: true
      },
      {
        name: 'Manager',
        description: 'Management access with read and update permissions',
        permissions: allPermissions
          .filter(p => p.action === 'read' || p.action === 'update')
          .map(p => p._id),
        isActive: true
      },
      {
        name: 'Viewer',
        description: 'Read-only access to most resources',
        permissions: allPermissions
          .filter(p => p.action === 'read')
          .map(p => p._id),
        isActive: true
      }
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await RoleModel.findOne({ name: roleData.name });
      if (!existingRole) {
        await RoleModel.create(roleData);
      }
    }
  }
}
