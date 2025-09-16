import mongoose from 'mongoose';
import { UserManagementModel } from './userManagement.model';
import AdminModel from '../admin/admin.model';
import ClientModel from '../client/client.model';

/**
 * Migration script to migrate existing admin and client users to the new unified user management system
 * This script should be run once to migrate existing data
 */

export class UserManagementMigration {
  /**
   * Migrate all existing admin users to the new user management system
   */
  static async migrateAdminUsers(): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    try {
      const adminUsers = await AdminModel.find({});
      
      for (const admin of adminUsers) {
        try {
          // Check if user already exists in user management
          const existingUser = await UserManagementModel.findOne({ email: admin.email });
          if (existingUser) {
            console.log(`Admin user ${admin.email} already exists in user management system`);
            continue;
          }

          // Create new user management record
          const newUser = new UserManagementModel({
            email: admin.email,
            firstName: admin.firstName || 'Admin',
            lastName: admin.lastName || 'User',
            phone: undefined, // Admin model doesn't have phone
            role: 'admin',
            status: admin.status ? 'active' : 'inactive',
            lastLogin: undefined, // Admin model doesn't have lastLogin
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            profileImage: admin.image,
            address: undefined, // Admin model doesn't have address
            preferences: undefined, // Admin model doesn't have preferences
            permissions: admin.permission ? Object.keys(admin.permission) : [],
            isEmailVerified: true, // Assume existing admins are verified
            password: admin.password, // This will be hashed by the pre-save middleware
          });

          await newUser.save();
          results.success++;
          console.log(`Successfully migrated admin user: ${admin.email}`);
        } catch (error) {
          results.failed++;
          const errorMsg = `Failed to migrate admin user ${admin.email}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = `Error during admin migration: ${error instanceof Error ? error.message : 'Unknown error'}`;
      results.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return results;
  }

  /**
   * Migrate all existing client users to the new user management system
   */
  static async migrateClientUsers(): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    try {
      const clientUsers = await ClientModel.find({});
      
      for (const client of clientUsers) {
        try {
          // Check if user already exists in user management
          const existingUser = await UserManagementModel.findOne({ email: client.email });
          if (existingUser) {
            console.log(`Client user ${client.email} already exists in user management system`);
            continue;
          }

          // Create new user management record
          const newUser = new UserManagementModel({
            email: client.email,
            firstName: client.firstName || 'Client',
            lastName: client.lastName || 'User',
            phone: client.phone?.toString(),
            role: 'client',
            status: client.status ? 'active' : 'inactive',
            lastLogin: undefined, // Client model doesn't have lastLogin
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
            profileImage: client.image,
            address: client.address ? { street: client.address } : undefined,
            preferences: undefined, // Client model doesn't have preferences
            permissions: [], // Client model doesn't have permissions
            isEmailVerified: true, // Assume existing clients are verified
            password: client.password, // This will be hashed by the pre-save middleware
          });

          await newUser.save();
          results.success++;
          console.log(`Successfully migrated client user: ${client.email}`);
        } catch (error) {
          results.failed++;
          const errorMsg = `Failed to migrate client user ${client.email}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = `Error during client migration: ${error instanceof Error ? error.message : 'Unknown error'}`;
      results.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return results;
  }

  /**
   * Run complete migration for all users
   */
  static async runCompleteMigration(): Promise<{
    adminResults: { success: number; failed: number; errors: string[] };
    clientResults: { success: number; failed: number; errors: string[] };
    totalSuccess: number;
    totalFailed: number;
  }> {
    console.log('Starting user management migration...');
    
    const adminResults = await this.migrateAdminUsers();
    const clientResults = await this.migrateClientUsers();
    
    const totalSuccess = adminResults.success + clientResults.success;
    const totalFailed = adminResults.failed + clientResults.failed;
    
    console.log('Migration completed!');
    console.log(`Admin users migrated: ${adminResults.success} success, ${adminResults.failed} failed`);
    console.log(`Client users migrated: ${clientResults.success} success, ${clientResults.failed} failed`);
    console.log(`Total: ${totalSuccess} success, ${totalFailed} failed`);
    
    if (adminResults.errors.length > 0) {
      console.log('Admin migration errors:', adminResults.errors);
    }
    
    if (clientResults.errors.length > 0) {
      console.log('Client migration errors:', clientResults.errors);
    }
    
    return {
      adminResults,
      clientResults,
      totalSuccess,
      totalFailed,
    };
  }

  /**
   * Verify migration by comparing counts
   */
  static async verifyMigration(): Promise<{
    adminCount: number;
    clientCount: number;
    userManagementCount: number;
    adminInUserManagement: number;
    clientInUserManagement: number;
    isComplete: boolean;
  }> {
    try {
      const [adminCount, clientCount, userManagementCount] = await Promise.all([
        AdminModel.countDocuments(),
        ClientModel.countDocuments(),
        UserManagementModel.countDocuments(),
      ]);

      const adminInUserManagement = await UserManagementModel.countDocuments({ role: 'admin' });
      const clientInUserManagement = await UserManagementModel.countDocuments({ role: 'client' });

      const isComplete = 
        adminCount === adminInUserManagement && 
        clientCount === clientInUserManagement;

      return {
        adminCount,
        clientCount,
        userManagementCount,
        adminInUserManagement,
        clientInUserManagement,
        isComplete,
      };
    } catch (error) {
      console.error('Error verifying migration:', error);
      throw error;
    }
  }

  /**
   * Rollback migration by removing migrated users
   */
  static async rollbackMigration(): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    try {
      const migratedUsers = await UserManagementModel.find({});
      
      for (const user of migratedUsers) {
        try {
          await UserManagementModel.findByIdAndDelete(user._id);
          results.success++;
          console.log(`Successfully rolled back user: ${user.email}`);
        } catch (error) {
          results.failed++;
          const errorMsg = `Failed to rollback user ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = `Error during rollback: ${error instanceof Error ? error.message : 'Unknown error'}`;
      results.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return results;
  }
}

// Export migration functions for use in scripts
export const migrateUsers = UserManagementMigration.runCompleteMigration;
export const verifyMigration = UserManagementMigration.verifyMigration;
export const rollbackMigration = UserManagementMigration.rollbackMigration;
