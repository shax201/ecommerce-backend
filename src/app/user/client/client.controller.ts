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
      // Get query parameters for pagination and filtering
      const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Use user management service to get all clients with proper filtering
      const result = await UserManagementService.getAllUsers({
        role: 'client',
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        status: status as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });
      
      // Convert user management format to client format
      const clients = result.users.map(user => {
        const status = user.status === 'active';
        console.log(`Client ${user.email}: status="${user.status}" -> boolean=${status}`);
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone ? parseInt(user.phone) : 0,
          address: user.address ? user.address.street : '',
          status: status, // Convert string to boolean
          image: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      });
      
      if (clients.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Clients fetched successfully',
          data: clients,
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
      
      const user = await UserManagementService.getUserById(trimmedId);
      
      if (user && user.role === 'client') {
        // Convert user management format to client format
        const client = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone ? parseInt(user.phone) : 0,
          address: user.address ? user.address.street : '',
          status: user.status === 'active', // Convert string to boolean
          image: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
        
        res.status(200).json({
          success: true,
          message: 'Client fetched successfully',
          data: client,
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
      
      console.log('Update client request body:', req.body);
      
      // Use user management validation for updates
      const parsedData = await UserManagementValidation.updateUserValidationSchema.parseAsync({
        body: req.body,
      });
      
      console.log('Parsed data:', parsedData.body);
      
      const user = await UserManagementService.updateUser(trimmedId, parsedData.body);
      
      if (user && user.role === 'client') {
        // Convert user management format to client format
        const client = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone ? parseInt(user.phone) : 0,
          address: user.address ? user.address.street : '',
          status: user.status === 'active', // Convert string to boolean
          image: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
        
        res.status(200).json({
          success: true,
          message: 'Client updated successfully',
          data: client,
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
      
      console.log('Delete client request for ID:', trimmedId);
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        console.log('Invalid client ID format:', trimmedId);
        return res.status(400).json({
          success: false,
          message: 'Invalid client ID format',
          data: null,
        });
      }
      
      // First check if user exists and is a client
      const user = await UserManagementService.getUserById(trimmedId);
      console.log('Found user:', user ? { id: user._id, role: user.role } : 'null');
      
      if (!user || user.role !== 'client') {
        console.log('Client not found or not a client role');
        return res.status(404).json({
          success: false,
          message: 'Client not found',
          data: null,
        });
      }
      
      const result = await UserManagementService.deleteUser(trimmedId);
      console.log('Delete result:', result);
      
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
      console.error('Error in deleteClient:', error);
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

const getClientStats = async (req: Request, res: Response) => {
    try {
      console.log('Getting client stats...');
      // Get all user stats first
      const allUserStats = await UserManagementService.getUserStats();
      console.log('All user stats:', allUserStats);
      
      // Filter to get only client-specific stats
      const clientStats = {
        totalClients: allUserStats.clientUsers,
        activeClients: 0,
        inactiveClients: 0,
        newClientsThisMonth: 0,
        newClientsThisWeek: 0,
        lastLoginStats: allUserStats.lastLoginStats,
        // Calculate client-specific stats
        totalUsers: allUserStats.totalUsers,
        adminUsers: allUserStats.adminUsers,
        clientUsers: allUserStats.clientUsers,
      };

      // Get additional client-specific stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const [activeClients, inactiveClients, newClientsThisMonth, newClientsThisWeek] = await Promise.all([
        UserManagementService.getAllUsers({ role: 'client', status: 'active', page: 1, limit: 1 }),
        UserManagementService.getAllUsers({ role: 'client', status: 'inactive', page: 1, limit: 1 }),
        UserManagementService.getAllUsers({ 
          role: 'client', 
          createdAt: { $gte: startOfMonth }, 
          page: 1, 
          limit: 1 
        }),
        UserManagementService.getAllUsers({ 
          role: 'client', 
          createdAt: { $gte: startOfWeek }, 
          page: 1, 
          limit: 1 
        }),
      ]);

      // Update the stats with actual counts from pagination
      clientStats.activeClients = activeClients.pagination?.total || 0;
      clientStats.inactiveClients = inactiveClients.pagination?.total || 0;
      clientStats.newClientsThisMonth = newClientsThisMonth.pagination?.total || 0;
      clientStats.newClientsThisWeek = newClientsThisWeek.pagination?.total || 0;

      console.log('Final client stats:', clientStats);

      res.status(200).json({
        success: true,
        message: 'Client statistics fetched successfully',
        data: clientStats,
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
    bulkDeleteClients,
    getClientStats
};


// <====Client Login===>
// email: sha@gmail.com
// password: 123456Qa


// <====Admin Login===>
// email: admin@gmail.com
// password: admin1234