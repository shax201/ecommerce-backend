import { z } from 'zod';

// Permission validation schemas
export const permissionCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Permission name is required').max(100, 'Permission name too long'),
    resource: z.enum([
      'users', 
      'products', 
      'categories', 
      'orders', 
      'coupons', 
      'content', 
      'reports', 
      'company-settings',
      'shipping-addresses'
    ], {
      errorMap: () => ({ message: 'Invalid resource type' })
    }),
    action: z.enum(['create', 'read', 'update', 'delete'], {
      errorMap: () => ({ message: 'Invalid action type' })
    }),
    description: z.string().optional()
  })
});

export const permissionUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Permission name is required').max(100, 'Permission name too long').optional(),
    resource: z.enum([
      'users', 
      'products', 
      'categories', 
      'orders', 
      'coupons', 
      'content', 
      'reports', 
      'company-settings',
      'shipping-addresses'
    ]).optional(),
    action: z.enum(['create', 'read', 'update', 'delete']).optional(),
    description: z.string().optional()
  })
});

// Role validation schemas
export const roleCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Role name is required').max(100, 'Role name too long'),
    description: z.string().optional(),
    permissions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid permission ID format')).optional(),
    isActive: z.boolean().optional().default(true)
  })
});

export const roleUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Role name is required').max(100, 'Role name too long').optional(),
    description: z.string().optional(),
    permissions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid permission ID format')).optional(),
    isActive: z.boolean().optional()
  })
});

export const roleAddPermissionsSchema = z.object({
  body: z.object({
    permissionIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid permission ID format')).min(1, 'At least one permission ID is required')
  })
});

export const roleRemovePermissionsSchema = z.object({
  body: z.object({
    permissionIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid permission ID format')).min(1, 'At least one permission ID is required')
  })
});

// User role validation schemas
export const userRoleAssignSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid role ID format')
  })
});

export const userRoleRemoveSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid role ID format')
  })
});

// Permission check validation schema
export const permissionCheckSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    resource: z.enum([
      'users', 
      'products', 
      'categories', 
      'orders', 
      'coupons', 
      'content', 
      'reports', 
      'company-settings',
      'shipping-addresses'
    ]),
    action: z.enum(['create', 'read', 'update', 'delete'])
  })
});

// Export validation objects
export const PermissionValidation = {
  permissionCreateSchema,
  permissionUpdateSchema,
  roleCreateSchema,
  roleUpdateSchema,
  roleAddPermissionsSchema,
  roleRemovePermissionsSchema,
  userRoleAssignSchema,
  userRoleRemoveSchema,
  permissionCheckSchema
};
