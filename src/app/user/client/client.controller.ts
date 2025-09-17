import { Request, Response } from 'express';
import { ClientValidation, updatePasswordSchema } from './client.validation';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import AdminModel from '../admin/admin.model';
import { AdminServices } from '../admin/admin.service';
import { UserManagementService } from '../userManagement/userManagement.service';
import { UserManagementValidation } from '../userManagement/userManagement.validation';

const createClient = async (req: Request, res: Response) => {
    try {
        // Use user management validation for more robust validation
        const parsedData = await UserManagementValidation.createUserValidationSchema.parseAsync({
            body: {
                ...req.body,
                role: 'client' // Ensure role is set to client
            },
        });

        // Check if user already exists using user management
        const existingUser = await UserManagementService.getUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists!',
            });
        }

        // Create user using user management service
        const result = await UserManagementService.createUser(parsedData.body);

        res.status(201).json({
            success: true,
            message: 'Client account created successfully',
            data: result,
        });
    } catch (error) {
        console.log('error', error);
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

const loginClient = async (req: Request, res: Response) => {
    try {
        const parsedData = await ClientValidation.clientLoginValidationSchema.parseAsync({
            body: req.body,
        });

        const { email, password } = parsedData.body;

        // Check if user exists in user management system
        const user = await UserManagementService.getUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if user is admin or client
        if (user.role === 'admin') {
            // For admin, use the existing admin service
            const isAdmin = await AdminModel.findOne({email});
            if (isAdmin) {
                const result = await AdminServices.loginAdmin(email, password);
                return res.status(200).json({
                    success: true,
                    message: 'Admin logged in successfully',
                    data: result,
                });
            }
        }

        // For client users, use user management login
        const result = await UserManagementService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Client logged in successfully',
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

const getAllClient = async (req: Request, res: Response) => {
    try {
      // Use user management service to get all clients
      const result = await UserManagementService.getAllUsers({
        role: 'client',
        page: 1,
        limit: 1000 // Get all clients
      });
      
      if (result.users.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Clients fetched successfully',
          data: result.users,
          pagination: result.pagination,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No clients found',
          data: [],
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

const getClientById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trimmedId = id.trim();
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid client ID format',
          data: null,
        });
      }
      
      const result = await UserManagementService.getUserById(trimmedId);
      
      if (result && result.role === 'client') {
        res.status(200).json({
          success: true,
          message: 'Client fetched successfully',
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Client not found',
          data: null,
        });
      }
    } catch (error) {
      console.error('Error in getClientById controller:', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };


const updateClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trimmedId = id.trim();
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid client ID format',
          data: null,
        });
      }
      
      // Use user management validation for updates
      const parsedData = await UserManagementValidation.updateUserValidationSchema.parseAsync({
        body: req.body,
      });
      
      const result = await UserManagementService.updateUser(trimmedId, parsedData.body);
      
      if (result && result.role === 'client') {
        res.status(200).json({
          success: true,
          message: 'Client updated successfully',
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Client not found',
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
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

const updateClientProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const trimmedId = id.trim();

        if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid client ID format',
                data: null,
            });
        }

        // Use user management validation for profile updates
        const parsedData = await UserManagementValidation.updateUserValidationSchema.parseAsync({
            body: req.body,
        });

        const result = await UserManagementService.updateUser(trimmedId, parsedData.body);

        if (result && result.role === 'client') {
            res.status(200).json({
                success: true,
                message: 'Client profile updated successfully',
                data: result,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Client not found',
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
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
};

export const updateClientPassword = async (req: Request, res: Response) => {
  try {
    const { clientId, oldPassword, newPassword } = updatePasswordSchema.parse({
      clientId: req.params.clientId,
      ...req.body,
    })

    // Use user management service for password change
    const result = await UserManagementService.changePassword(clientId, oldPassword, newPassword);
    
    if (result) {
      return res.status(200).json({ success: true, message: "Password updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Current password is incorrect') {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
    
    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({ success: false, message: "Invalid client ID format" });
    }
    
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

const deleteClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trimmedId = id.trim();
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid client ID format',
          data: null,
        });
      }
      
      // First check if user exists and is a client
      const user = await UserManagementService.getUserById(trimmedId);
      if (!user || user.role !== 'client') {
        return res.status(404).json({
          success: false,
          message: 'Client not found',
          data: null,
        });
      }
      
      const result = await UserManagementService.deleteUser(trimmedId);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Client deleted successfully',
          data: null,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Client not found',
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

const bulkUpdateClientStatus = async (req: Request, res: Response) => {
    try {
      const { ids, status } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Client IDs array is required and must not be empty',
        });
      }
      
      if (typeof status !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Status must be a boolean value',
        });
      }
      
      // Use user management bulk operation
      const result = await UserManagementService.bulkOperation({
        userIds: ids,
        operation: status ? 'activate' : 'deactivate',
      });
      
      res.status(200).json({
        success: true,
        message: `Successfully ${status ? 'activated' : 'deactivated'} ${result.success.length} client(s)`,
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

const bulkDeleteClients = async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Client IDs array is required and must not be empty',
        });
      }
      
      // Use user management bulk operation
      const result = await UserManagementService.bulkOperation({
        userIds: ids,
        operation: 'delete',
      });
      
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.success.length} client(s)`,
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

export const ClientsControllers = {
    createClient,
    loginClient,
    getAllClient,
    getClientById,
    updateClient,
    updateClientProfile,
    deleteClient,
    bulkUpdateClientStatus,
    bulkDeleteClients
};


// <====Client Login===>
// email: sha@gmail.com
// password: 123456Qa


// <====Admin Login===>
// email: admin@gmail.com
// password: admin1234