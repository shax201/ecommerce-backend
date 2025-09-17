import { Response } from 'express';
import { UserSettingsService } from './userSettings.service';
import { UserSettingsValidation } from './userSettings.validation';
import { ZodError } from 'zod';
import { AuthRequest } from '../../../middlewares/auth.middleware';

// Get user's own profile
export const getOwnProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.getOwnProfile(userId);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Update user's own profile (names only)
export const updateOwnProfile = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = await UserSettingsValidation.updateProfileValidationSchema.parseAsync({
      body: req.body,
    });

    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.updateOwnProfile(userId, parsedData.body);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
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

    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Update user's own email
export const updateOwnEmail = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = await UserSettingsValidation.updateEmailValidationSchema.parseAsync({
      body: req.body,
    });

    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.updateOwnEmail(userId, parsedData.body);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Email updated successfully. Please verify your new email address.',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
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

    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    if (error instanceof Error && error.message === 'Current password is incorrect') {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        error: error.message,
      });
    }

    if (error instanceof Error && error.message === 'Email already exists') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Change user's own password
export const changeOwnPassword = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = await UserSettingsValidation.changeOwnPasswordValidationSchema.parseAsync({
      body: req.body,
    });

    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.changeOwnPassword(userId, parsedData.body);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
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

    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    if (error instanceof Error && error.message === 'Current password is incorrect') {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Update user's own phone
export const updateOwnPhone = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = await UserSettingsValidation.updatePhoneValidationSchema.parseAsync({
      body: req.body,
    });

    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.updateOwnPhone(userId, parsedData.body);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Phone number updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
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

    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Update user's own preferences
export const updateOwnPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = await UserSettingsValidation.updatePreferencesValidationSchema.parseAsync({
      body: req.body,
    });

    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.updateOwnPreferences(userId, parsedData.body);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
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

    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Get user's own preferences
export const getOwnPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'User not authenticated',
      });
    }

    const result = await UserSettingsService.getOwnPreferences(userId);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Preferences fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const UserSettingsControllers = {
  getOwnProfile,
  updateOwnProfile,
  updateOwnEmail,
  changeOwnPassword,
  updateOwnPhone,
  updateOwnPreferences,
  getOwnPreferences,
};
