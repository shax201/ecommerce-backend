import { UserManagementModel, IUserManagement } from './userManagement.model';
import { IUserManagementCreate, IUserManagementUpdate, IUserManagementQuery, IUserManagementStats, IUserManagementBulkOperation } from './userManagement.interface';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export class UserManagementService {
  // Create a new user
  static async createUser(userData: IUserManagementCreate): Promise<IUserManagement> {
    try {
      // Check if user already exists
      const existingUser = await UserManagementModel.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new UserManagementModel({
        ...userData,
        email: userData.email.toLowerCase(),
      });

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get all users with pagination and filtering
  static async getAllUsers(query: IUserManagementQuery): Promise<{
    users: IUserManagement[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        role,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        dateFrom,
        dateTo,
      } = query;

      // Build filter object
      const filter: any = {};

      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      if (role) {
        filter.role = role;
      }

      if (status) {
        filter.status = status;
      }

      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute queries
      const [users, total] = await Promise.all([
        UserManagementModel.find(filter)
          .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        UserManagementModel.countDocuments(filter),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findById(id)
        .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<IUserManagement | null> {
    try {
      const user = await UserManagementModel.findOne({ email: email.toLowerCase() })
        .select('+password');
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async updateUser(id: string, updateData: IUserManagementUpdate): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const result = await UserManagementModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  // Update user status
  static async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended', reason?: string): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findByIdAndUpdate(
        id,
        { 
          $set: { status },
          $push: { 
            statusHistory: {
              status,
              reason,
              changedAt: new Date(),
            }
          }
        },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user role
  static async updateUserRole(id: string, role: 'admin' | 'client', permissions?: string[]): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const updateData: any = { role };
      if (permissions) {
        updateData.permissions = permissions;
      }

      const user = await UserManagementModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change user password
  static async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findById(id).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Reset user password
  static async resetPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations
  static async bulkOperation(operation: IUserManagementBulkOperation): Promise<{
    success: string[];
    failed: { id: string; error: string }[];
  }> {
    try {
      const { userIds, operation: op, data } = operation;
      const results = { success: [] as string[], failed: [] as { id: string; error: string }[] };

      for (const userId of userIds) {
        try {
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            results.failed.push({ id: userId, error: 'Invalid user ID format' });
            continue;
          }

          let updateData: any = {};
          
          switch (op) {
            case 'activate':
              updateData = { status: 'active' };
              break;
            case 'deactivate':
              updateData = { status: 'inactive' };
              break;
            case 'suspend':
              updateData = { status: 'suspended' };
              break;
            case 'changeRole':
              if (data?.role) {
                updateData = { role: data.role };
                if (data.permissions) {
                  updateData.permissions = data.permissions;
                }
              }
              break;
            case 'delete':
              await UserManagementModel.findByIdAndDelete(userId);
              results.success.push(userId);
              continue;
          }

          if (Object.keys(updateData).length > 0) {
            await UserManagementModel.findByIdAndUpdate(userId, { $set: updateData });
            results.success.push(userId);
          }
        } catch (error) {
          results.failed.push({ 
            id: userId, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<IUserManagementStats> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        adminUsers,
        clientUsers,
        newUsersThisMonth,
        newUsersThisWeek,
        lastLoginToday,
        lastLoginThisWeek,
        lastLoginThisMonth,
      ] = await Promise.all([
        UserManagementModel.countDocuments(),
        UserManagementModel.countDocuments({ status: 'active' }),
        UserManagementModel.countDocuments({ status: 'inactive' }),
        UserManagementModel.countDocuments({ status: 'suspended' }),
        UserManagementModel.countDocuments({ role: 'admin' }),
        UserManagementModel.countDocuments({ role: 'client' }),
        UserManagementModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
        UserManagementModel.countDocuments({ createdAt: { $gte: startOfWeek } }),
        UserManagementModel.countDocuments({ lastLogin: { $gte: startOfDay } }),
        UserManagementModel.countDocuments({ lastLogin: { $gte: startOfWeek } }),
        UserManagementModel.countDocuments({ lastLogin: { $gte: startOfMonth } }),
      ]);

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        adminUsers,
        clientUsers,
        newUsersThisMonth,
        newUsersThisWeek,
        lastLoginStats: {
          today: lastLoginToday,
          thisWeek: lastLoginThisWeek,
          thisMonth: lastLoginThisMonth,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async loginUser(email: string, password: string): Promise<{
    user: IUserManagement;
    token: string;
  }> {
    try {
      const user = await UserManagementModel.findOne({ email: email.toLowerCase() })
        .select('+password');
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      if (user.status !== 'active') {
        throw new Error('Account is not active');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token (you'll need to implement this based on your JWT setup)
      const token = 'jwt-token-here'; // Replace with actual JWT generation

      return {
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  // Search users
  static async searchUsers(searchTerm: string, filters: any = {}): Promise<IUserManagement[]> {
    try {
      const query: any = {
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
        ...filters,
      };

      const users = await UserManagementModel.find(query)
        .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
        .limit(50);

      return users;
    } catch (error) {
      throw error;
    }
  }
}
