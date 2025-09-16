# Permission Management System

A comprehensive role-based access control (RBAC) system for the ecommerce backend that provides fine-grained permission management for CRUD operations.

## Features

- **Role-Based Access Control (RBAC)**: Define roles and assign permissions to them
- **Resource-Based Permissions**: Control access to specific resources (users, products, orders, etc.)
- **Action-Based Permissions**: Control specific actions (create, read, update, delete)
- **User Role Assignment**: Assign multiple roles to users
- **Permission Middleware**: Easy-to-use middleware for protecting routes
- **Default Roles & Permissions**: Pre-configured roles and permissions for quick setup

## Architecture

### Models

1. **Permission**: Defines individual permissions for specific resource-action combinations
2. **Role**: Groups permissions together and can be assigned to users
3. **UserRole**: Links users to roles with assignment tracking

### Resources

The system supports the following resources:
- `users` - User management
- `products` - Product management
- `categories` - Category management
- `orders` - Order management
- `coupons` - Coupon management
- `content` - Content management
- `reports` - Report management
- `company-settings` - Company settings
- `shipping-addresses` - Shipping address management

### Actions

Each resource supports these actions:
- `create` - Create new records
- `read` - View/read records
- `update` - Modify existing records
- `delete` - Remove records

## API Endpoints

### Permissions

- `POST /api/v1/permissions/permissions` - Create permission
- `GET /api/v1/permissions/permissions` - Get all permissions
- `GET /api/v1/permissions/permissions/:id` - Get permission by ID
- `PUT /api/v1/permissions/permissions/:id` - Update permission
- `DELETE /api/v1/permissions/permissions/:id` - Delete permission

### Roles

- `POST /api/v1/permissions/roles` - Create role
- `GET /api/v1/permissions/roles` - Get all roles
- `GET /api/v1/permissions/roles/:id` - Get role by ID
- `PUT /api/v1/permissions/roles/:id` - Update role
- `DELETE /api/v1/permissions/roles/:id` - Delete role
- `POST /api/v1/permissions/roles/:id/permissions` - Add permissions to role
- `DELETE /api/v1/permissions/roles/:id/permissions` - Remove permissions from role

### User Roles

- `POST /api/v1/permissions/user-roles/assign` - Assign role to user
- `GET /api/v1/permissions/user-roles/:userId` - Get user roles
- `DELETE /api/v1/permissions/user-roles/remove` - Remove role from user

### Permission Checks

- `POST /api/v1/permissions/check-permission` - Check user permission
- `GET /api/v1/permissions/user-permissions/:userId` - Get user permissions

### Utilities

- `POST /api/v1/permissions/initialize` - Initialize default permissions and roles

## Usage

### 1. Initialize Default Data

First, initialize the default permissions and roles:

```bash
# Run the seed script
node seed-permissions.js

# Or use the API endpoint
POST /api/v1/permissions/initialize
```

### 2. Using Permission Middleware

#### Basic Permission Check

```typescript
import { requirePermission } from '../middlewares/permission.middleware';

// Require specific permission
router.get('/users', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  getUsersController
);
```

#### Multiple Permission Checks

```typescript
import { requireAnyPermission, requireAllPermissions } from '../middlewares/permission.middleware';

// Require any of the specified permissions
router.post('/products', 
  authMiddleware, 
  requireAnyPermission([
    { resource: 'products', action: 'create' },
    { resource: 'products', action: 'update' }
  ]), 
  createProductController
);

// Require all specified permissions
router.delete('/users/:id', 
  authMiddleware, 
  requireAllPermissions([
    { resource: 'users', action: 'delete' },
    { resource: 'users', action: 'read' }
  ]), 
  deleteUserController
);
```

#### Admin Check

```typescript
import { requireAdmin } from '../middlewares/permission.middleware';

// Require admin role
router.get('/admin-only', 
  authMiddleware, 
  requireAdmin, 
  adminOnlyController
);
```

### 3. Managing Roles and Permissions

#### Create a Role

```typescript
const roleData = {
  name: 'Product Manager',
  description: 'Can manage products and categories',
  permissions: ['permission_id_1', 'permission_id_2']
};

const role = await PermissionService.createRole(roleData);
```

#### Assign Role to User

```typescript
const assignment = await PermissionService.assignRoleToUser(
  userId, 
  roleId, 
  assignedByUserId
);
```

#### Check User Permission

```typescript
const hasPermission = await PermissionService.checkUserPermission(
  userId, 
  'products', 
  'create'
);
```

## Default Roles

The system comes with these pre-configured roles:

1. **Super Admin**: Full system access with all permissions
2. **Admin**: Administrative access with most permissions
3. **Manager**: Management access with read and update permissions
4. **Viewer**: Read-only access to most resources

## Security Features

- **JWT Authentication**: All protected routes require valid JWT tokens
- **Role Validation**: Users must have appropriate roles to access resources
- **Permission Granularity**: Fine-grained control over what users can do
- **Audit Trail**: Track who assigned roles and when
- **Soft Deletes**: Roles and permissions are soft-deleted to maintain data integrity

## Error Handling

The middleware provides clear error messages:

- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User lacks required permissions
- `400 Bad Request`: Invalid request data
- `500 Internal Server Error`: Server-side errors

## Database Schema

### Permission Schema
```typescript
{
  name: string;
  resource: PermissionResource;
  action: PermissionAction;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Role Schema
```typescript
{
  name: string;
  description?: string;
  permissions: ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserRole Schema
```typescript
{
  userId: ObjectId;
  roleId: ObjectId;
  assignedBy: ObjectId;
  assignedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Best Practices

1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Regular Audits**: Periodically review user roles and permissions
3. **Role Hierarchy**: Use role inheritance where appropriate
4. **Permission Naming**: Use clear, descriptive names for permissions
5. **Error Logging**: Log permission denials for security monitoring

## Migration from Existing System

If you're migrating from an existing permission system:

1. Run the initialization script to create default permissions
2. Map existing roles to new permission structure
3. Update route middleware to use new permission system
4. Test thoroughly in development environment
5. Deploy with proper monitoring

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check if user has required role and permissions
2. **Invalid Token**: Ensure JWT token is valid and not expired
3. **Role Not Found**: Verify role exists and is active
4. **User Not Found**: Check if user exists in the system

### Debug Mode

Enable debug logging to troubleshoot permission issues:

```typescript
// In your environment variables
DEBUG_PERMISSIONS=true
```

This will log detailed permission checks to the console.
