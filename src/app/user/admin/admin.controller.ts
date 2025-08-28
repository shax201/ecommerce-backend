import { Request, Response } from 'express';
import { AdminServices } from './admin.service';
import { AdminValidation } from './admin.validation';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

const createAdmin = async (req: Request, res: Response) => {
    try {
        const parsedData = await AdminValidation.adminValidationSchema.parseAsync({
            body: req.body,
        });

        const result = await AdminServices.createAdmin(parsedData.body);

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
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

const loginAdmin = async (req: Request, res: Response) => {
    try {
        const parsedData = await AdminValidation.adminLoginValidationSchema.parseAsync({
            body: req.body,
        });

        const { email, password } = parsedData.body;
        const result = await AdminServices.loginAdmin(email, password);

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
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
        
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
};

const getAllAdmin = async (req: Request, res: Response) => {
    try {
      const result = await AdminServices.getAllAdmin();
      if (result.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Admins fetched successfully',
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No admin found',
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

const getAdminById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trimmedId = id.trim();
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID format',
          data: null,
        });
      }
      
      const result = await AdminServices.getAdminById(trimmedId);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Admin fetched successfully',
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Admin not found',
          data: null,
        });
      }
    } catch (error) {
      console.error('Error in getAdminById controller:', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

const updateAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trimmedId = id.trim();
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID format',
          data: null,
        });
      }
      
      const parsedData = await AdminValidation.adminUpdateValidationSchema.parseAsync({
        body: req.body,
    });
      
      const result = await AdminServices.updateAdmin(trimmedId, parsedData.body);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Admin updated successfully',
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Admin not found',
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

const deleteAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trimmedId = id.trim();
      
      if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID format',
          data: null,
        });
      }
      
      const result = await AdminServices.deleteAdmin(trimmedId);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Admin deleted successfully',
          data: null,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Admin not found',
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

export const AdminControllers = {
    createAdmin,
    loginAdmin,
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
};