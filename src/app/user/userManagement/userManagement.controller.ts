import { Request, Response } from 'express';
import { UserManagementService } from './userManagement.service';
import { UserManagementValidation } from './userManagement.validation';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.createUserValidationSchema.parseAsync({
      body: req.body,
    });

    const result = await UserManagementService.createUser(parsedData.body);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
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
    
    if (error instanceof Error && error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
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

// Get all users with pagination and filtering
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.userQueryValidationSchema.parseAsync({
      query: req.query,
    });

    // Convert date strings to Date objects if they exist
    const queryData = {
      ...parsedData.query,
      dateFrom: parsedData.query.dateFrom ? new Date(parsedData.query.dateFrom) : undefined,
      dateTo: parsedData.query.dateTo ? new Date(parsedData.query.dateTo) : undefined,
    };

    const result = await UserManagementService.getAllUsers(queryData);

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: result.users,
      pagination: result.pagination,
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

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'User ID is required',
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: 'Invalid user ID format',
      });
    }

    const result = await UserManagementService.getUserById(id);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User fetched successfully',
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

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.updateUserValidationSchema.parseAsync({
      body: req.body,
    });

    const { id } = req.params;
    const result = await UserManagementService.updateUser(id, parsedData.body);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
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

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'User ID is required',
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: 'Invalid user ID format',
      });
    }

    const result = await UserManagementService.deleteUser(id);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
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

// Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.userStatusValidationSchema.parseAsync({
      body: req.body,
    });

    const { id } = req.params;
    const { status, reason } = parsedData.body;
    
    const result = await UserManagementService.updateUserStatus(id, status, reason);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
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

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.userRoleValidationSchema.parseAsync({
      body: req.body,
    });

    const { id } = req.params;
    const { role, permissions } = parsedData.body;
    
    const result = await UserManagementService.updateUserRole(id, role, permissions);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
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

// Change user password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.changePasswordValidationSchema.parseAsync({
      body: req.body,
    });

    const { id } = req.params;
    const { currentPassword, newPassword } = parsedData.body;
    
    const result = await UserManagementService.changePassword(id, currentPassword, newPassword);

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

// Reset user password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'User ID is required',
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required',
        error: 'New password is required',
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
        error: 'Password must be at least 8 characters long',
      });
    }

    const result = await UserManagementService.resetPassword(id, newPassword);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
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

// Bulk operations
export const bulkOperation = async (req: Request, res: Response) => {
  try {
    const parsedData = await UserManagementValidation.bulkOperationValidationSchema.parseAsync({
      body: req.body,
    });

    const result = await UserManagementService.bulkOperation(parsedData.body);

    res.status(200).json({
      success: true,
      message: 'Bulk operation completed',
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

// Get user statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const result = await UserManagementService.getUserStats();

    res.status(200).json({
      success: true,
      message: 'User statistics fetched successfully',
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

// Search users
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q: searchTerm, role, status } = req.query;

    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search term is required',
        error: 'Search term is required',
      });
    }

    const filters: any = {};
    if (role) filters.role = role;
    if (status) filters.status = status;

    const result = await UserManagementService.searchUsers(searchTerm, filters);

    res.status(200).json({
      success: true,
      message: 'Users searched successfully',
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

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        error: 'Email and password are required',
      });
    }

    const result = await UserManagementService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: error.message,
      });
    }

    if (error instanceof Error && error.message === 'Account is not active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active',
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

export const UserManagementControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  changePassword,
  resetPassword,
  bulkOperation,
  getUserStats,
  searchUsers,
  loginUser,
};
