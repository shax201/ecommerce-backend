# User Management Module

This module provides comprehensive user management functionality for the e-commerce application, including user CRUD operations, role management, status management, and bulk operations.

## Features

### Core Functionality
- **User CRUD Operations**: Create, read, update, and delete users
- **Role Management**: Assign and manage user roles (admin/client)
- **Status Management**: Control user account status (active/inactive/suspended)
- **Password Management**: Change passwords and reset passwords
- **Bulk Operations**: Perform operations on multiple users at once
- **Search & Filtering**: Advanced search and filtering capabilities
- **User Statistics**: Comprehensive user analytics and reporting

### User Roles
- **Admin**: Full system access with administrative privileges
- **Client**: Standard user access for customers

### User Status
- **Active**: User can log in and use the system
- **Inactive**: User account is disabled but not deleted
- **Suspended**: User account is temporarily disabled

## API Endpoints

### Public Endpoints
- `POST /api/v1/user-management/login` - User login

### Protected Endpoints (Require Authentication & Permissions)

#### User Management
- `POST /api/v1/user-management` - Create new user
- `GET /api/v1/user-management` - Get all users (with pagination & filtering)
- `GET /api/v1/user-management/search` - Search users
- `GET /api/v1/user-management/stats` - Get user statistics
- `GET /api/v1/user-management/:id` - Get user by ID
- `PUT /api/v1/user-management/:id` - Update user
- `DELETE /api/v1/user-management/:id` - Delete user

#### User Status Management
- `PUT /api/v1/user-management/:id/status` - Update user status

#### User Role Management
- `PUT /api/v1/user-management/:id/role` - Update user role

#### Password Management
- `PUT /api/v1/user-management/:id/password` - Change user password
- `PUT /api/v1/user-management/:id/reset-password` - Reset user password

#### Bulk Operations
- `POST /api/v1/user-management/bulk` - Perform bulk operations

## Request/Response Examples

### Create User
```json
POST /api/v1/user-management
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "client",
  "password": "SecurePass123",
  "status": "active",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "preferences": {
    "language": "en",
    "currency": "USD",
    "notifications": true
  }
}
```

### Get Users with Filtering
```json
GET /api/v1/user-management?page=1&limit=10&search=john&role=client&status=active&sortBy=createdAt&sortOrder=desc
```

### Update User Status
```json
PUT /api/v1/user-management/:id/status
{
  "status": "suspended",
  "reason": "Violation of terms of service"
}
```

### Bulk Operation
```json
POST /api/v1/user-management/bulk
{
  "userIds": ["64a1b2c3d4e5f6789012345", "64a1b2c3d4e5f6789012346"],
  "operation": "activate",
  "data": {
    "status": "active"
  }
}
```

## Data Models

### User Management Interface
```typescript
interface IUserManagement {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'client';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  permissions?: string[];
  isEmailVerified: boolean;
}
```

## Validation

The module includes comprehensive validation using Zod schemas:

- **Email validation**: Proper email format
- **Password validation**: Minimum 8 characters with uppercase, lowercase, and number
- **Name validation**: Minimum 2 characters for first and last names
- **Role validation**: Must be 'admin' or 'client'
- **Status validation**: Must be 'active', 'inactive', or 'suspended'
- **Phone validation**: Optional phone number format
- **Address validation**: Optional address fields
- **Preferences validation**: Optional user preferences

## Security Features

- **Password hashing**: All passwords are hashed using bcrypt
- **Input validation**: Comprehensive input validation and sanitization
- **Permission-based access**: All endpoints require appropriate permissions
- **Authentication**: JWT-based authentication required for protected routes
- **Rate limiting**: Built-in rate limiting for security

## Error Handling

The module provides comprehensive error handling:

- **Validation errors**: Detailed validation error messages
- **Authentication errors**: Proper authentication error responses
- **Authorization errors**: Permission-based error responses
- **Not found errors**: User not found error handling
- **Server errors**: Generic server error handling

## Usage Examples

### Creating a new admin user
```typescript
const adminUser = await UserManagementService.createUser({
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  password: 'AdminPass123',
  status: 'active',
  permissions: ['users:read', 'users:write', 'users:delete']
});
```

### Getting user statistics
```typescript
const stats = await UserManagementService.getUserStats();
console.log(`Total users: ${stats.totalUsers}`);
console.log(`Active users: ${stats.activeUsers}`);
```

### Bulk user activation
```typescript
const result = await UserManagementService.bulkOperation({
  userIds: ['user1', 'user2', 'user3'],
  operation: 'activate',
  data: { status: 'active' }
});
```

## Dependencies

- **MongoDB**: Database for user storage
- **Mongoose**: ODM for MongoDB
- **bcryptjs**: Password hashing
- **Zod**: Schema validation
- **Express**: Web framework
- **JWT**: Authentication (to be implemented)

## Future Enhancements

- [ ] Email verification system
- [ ] Password reset via email
- [ ] User activity logging
- [ ] Advanced user analytics
- [ ] User import/export functionality
- [ ] Multi-factor authentication
- [ ] User session management
- [ ] Advanced permission system
