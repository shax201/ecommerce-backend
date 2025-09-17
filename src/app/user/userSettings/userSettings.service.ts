import { UserManagementModel, IUserManagement } from '../userManagement/userManagement.model';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUpdateProfile {
  firstName: string;
  lastName: string;
}

export interface IUpdateEmail {
  newEmail: string;
  currentPassword: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdatePhone {
  phone?: string;
}

export interface IUpdatePreferences {
  language?: string;
  currency?: string;
  notifications?: boolean;
}

export class UserSettingsService {
  // Get user's own profile
  static async getOwnProfile(userId: string): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findById(userId)
        .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
        .lean();

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user's own profile (names only)
  static async updateOwnProfile(userId: string, profileData: IUpdateProfile): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findByIdAndUpdate(
        userId,
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user's own email
  static async updateOwnEmail(userId: string, emailData: IUpdateEmail): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // First verify the current password
      const user = await UserManagementModel.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.comparePassword(emailData.currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Check if new email already exists
      const existingUser = await UserManagementModel.findOne({ 
        email: emailData.newEmail.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Update email
      const updatedUser = await UserManagementModel.findByIdAndUpdate(
        userId,
        {
          email: emailData.newEmail.toLowerCase(),
          isEmailVerified: false, // Reset email verification status
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Change user's own password
  static async changeOwnPassword(userId: string, passwordData: IChangePassword): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // First verify the current password
      const user = await UserManagementModel.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.comparePassword(passwordData.currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, saltRounds);

      // Update password
      await UserManagementModel.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        { runValidators: true }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update user's own phone
  static async updateOwnPhone(userId: string, phoneData: IUpdatePhone): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findByIdAndUpdate(
        userId,
        {
          phone: phoneData.phone || null,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user's own preferences
  static async updateOwnPreferences(userId: string, preferencesData: IUpdatePreferences): Promise<IUserManagement | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      // Only update preferences that are provided
      if (preferencesData.language !== undefined) {
        updateData['preferences.language'] = preferencesData.language;
      }
      if (preferencesData.currency !== undefined) {
        updateData['preferences.currency'] = preferencesData.currency;
      }
      if (preferencesData.notifications !== undefined) {
        updateData['preferences.notifications'] = preferencesData.notifications;
      }

      const user = await UserManagementModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user's own preferences
  static async getOwnPreferences(userId: string): Promise<{
    language: string;
    currency: string;
    notifications: boolean;
  } | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await UserManagementModel.findById(userId)
        .select('preferences')
        .lean();

      if (!user) {
        return null;
      }

      return {
        language: user.preferences?.language || 'en',
        currency: user.preferences?.currency || 'USD',
        notifications: user.preferences?.notifications ?? true,
      };
    } catch (error) {
      throw error;
    }
  }
}
