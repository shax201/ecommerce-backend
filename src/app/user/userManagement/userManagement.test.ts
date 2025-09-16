import { UserManagementService } from './userManagement.service';
import { UserManagementModel } from './userManagement.model';
import mongoose from 'mongoose';

// Mock data for testing
const mockUserData = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  role: 'client' as const,
  password: 'TestPass123',
  status: 'active' as const,
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: true,
  },
};

const mockAdminData = {
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1234567890',
  role: 'admin' as const,
  password: 'AdminPass123',
  status: 'active' as const,
  permissions: ['users:read', 'users:write', 'users:delete'],
};

describe('UserManagementService', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ecommerce_test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await UserManagementModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await UserManagementModel.deleteMany({});
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const user = await UserManagementService.createUser(mockUserData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(mockUserData.email);
      expect(user.firstName).toBe(mockUserData.firstName);
      expect(user.lastName).toBe(mockUserData.lastName);
      expect(user.role).toBe(mockUserData.role);
      expect(user.status).toBe(mockUserData.status);
    });

    it('should throw error for duplicate email', async () => {
      await UserManagementService.createUser(mockUserData);
      
      await expect(UserManagementService.createUser(mockUserData))
        .rejects.toThrow('User with this email already exists');
    });

    it('should hash password before saving', async () => {
      const user = await UserManagementService.createUser(mockUserData);
      
      expect(user.password).not.toBe(mockUserData.password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });
  });

  describe('getAllUsers', () => {
    beforeEach(async () => {
      // Create test users
      await UserManagementService.createUser(mockUserData);
      await UserManagementService.createUser(mockAdminData);
    });

    it('should return all users with pagination', async () => {
      const result = await UserManagementService.getAllUsers({ page: 1, limit: 10 });
      
      expect(result.users).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter users by role', async () => {
      const result = await UserManagementService.getAllUsers({ 
        page: 1, 
        limit: 10, 
        role: 'admin' 
      });
      
      expect(result.users).toHaveLength(1);
      expect(result.users[0].role).toBe('admin');
    });

    it('should search users by name', async () => {
      const result = await UserManagementService.getAllUsers({ 
        page: 1, 
        limit: 10, 
        search: 'John' 
      });
      
      expect(result.users).toHaveLength(1);
      expect(result.users[0].firstName).toBe('John');
    });
  });

  describe('getUserById', () => {
    it('should return user by valid ID', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      const user = await UserManagementService.getUserById(createdUser._id.toString());
      
      expect(user).toBeDefined();
      expect(user?.email).toBe(mockUserData.email);
    });

    it('should return null for invalid ID', async () => {
      const user = await UserManagementService.getUserById('invalid-id');
      
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      const updateData = { firstName: 'Jane', lastName: 'Smith' };
      
      const updatedUser = await UserManagementService.updateUser(
        createdUser._id.toString(), 
        updateData
      );
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.firstName).toBe('Jane');
      expect(updatedUser?.lastName).toBe('Smith');
    });

    it('should return null for non-existent user', async () => {
      const updateData = { firstName: 'Jane' };
      const updatedUser = await UserManagementService.updateUser(
        '507f1f77bcf86cd799439011', 
        updateData
      );
      
      expect(updatedUser).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      const result = await UserManagementService.deleteUser(createdUser._id.toString());
      
      expect(result).toBe(true);
      
      const deletedUser = await UserManagementService.getUserById(createdUser._id.toString());
      expect(deletedUser).toBeNull();
    });

    it('should return false for non-existent user', async () => {
      const result = await UserManagementService.deleteUser('507f1f77bcf86cd799439011');
      
      expect(result).toBe(false);
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status successfully', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      const updatedUser = await UserManagementService.updateUserStatus(
        createdUser._id.toString(), 
        'suspended', 
        'Violation of terms'
      );
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.status).toBe('suspended');
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      const updatedUser = await UserManagementService.updateUserRole(
        createdUser._id.toString(), 
        'admin', 
        ['users:read', 'users:write']
      );
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.role).toBe('admin');
      expect(updatedUser?.permissions).toEqual(['users:read', 'users:write']);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      const result = await UserManagementService.changePassword(
        createdUser._id.toString(), 
        'TestPass123', 
        'NewPass123'
      );
      
      expect(result).toBe(true);
    });

    it('should throw error for incorrect current password', async () => {
      const createdUser = await UserManagementService.createUser(mockUserData);
      
      await expect(UserManagementService.changePassword(
        createdUser._id.toString(), 
        'WrongPass123', 
        'NewPass123'
      )).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('bulkOperation', () => {
    beforeEach(async () => {
      // Create test users
      await UserManagementService.createUser(mockUserData);
      await UserManagementService.createUser(mockAdminData);
    });

    it('should perform bulk activation successfully', async () => {
      const users = await UserManagementService.getAllUsers({ page: 1, limit: 10 });
      const userIds = users.users.map(user => user._id.toString());
      
      const result = await UserManagementService.bulkOperation({
        userIds,
        operation: 'activate',
        data: { status: 'active' }
      });
      
      expect(result.success).toHaveLength(2);
      expect(result.failed).toHaveLength(0);
    });

    it('should handle bulk operation with invalid IDs', async () => {
      const result = await UserManagementService.bulkOperation({
        userIds: ['invalid-id', 'another-invalid-id'],
        operation: 'activate',
        data: { status: 'active' }
      });
      
      expect(result.success).toHaveLength(0);
      expect(result.failed).toHaveLength(2);
    });
  });

  describe('getUserStats', () => {
    beforeEach(async () => {
      // Create test users
      await UserManagementService.createUser(mockUserData);
      await UserManagementService.createUser(mockAdminData);
    });

    it('should return user statistics', async () => {
      const stats = await UserManagementService.getUserStats();
      
      expect(stats.totalUsers).toBe(2);
      expect(stats.adminUsers).toBe(1);
      expect(stats.clientUsers).toBe(1);
      expect(stats.activeUsers).toBe(2);
    });
  });

  describe('searchUsers', () => {
    beforeEach(async () => {
      // Create test users
      await UserManagementService.createUser(mockUserData);
      await UserManagementService.createUser(mockAdminData);
    });

    it('should search users by name', async () => {
      const users = await UserManagementService.searchUsers('John');
      
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe('John');
    });

    it('should search users by email', async () => {
      const users = await UserManagementService.searchUsers('admin@example.com');
      
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('admin@example.com');
    });

    it('should filter search results by role', async () => {
      const users = await UserManagementService.searchUsers('', { role: 'admin' });
      
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe('admin');
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await UserManagementService.createUser(mockUserData);
    });

    it('should login user with correct credentials', async () => {
      const result = await UserManagementService.loginUser(
        mockUserData.email, 
        mockUserData.password
      );
      
      expect(result).toBeDefined();
      expect(result.user.email).toBe(mockUserData.email);
      expect(result.token).toBeDefined();
    });

    it('should throw error for incorrect password', async () => {
      await expect(UserManagementService.loginUser(
        mockUserData.email, 
        'wrongpassword'
      )).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for non-existent user', async () => {
      await expect(UserManagementService.loginUser(
        'nonexistent@example.com', 
        'password'
      )).rejects.toThrow('Invalid email or password');
    });
  });
});
