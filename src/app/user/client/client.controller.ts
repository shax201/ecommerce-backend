import { Request, Response } from 'express';
import { ClientServices } from './client.service';
import { ClientValidation, updatePasswordSchema } from './client.validation';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import ClientModel from './client.model';
import bcrypt from "bcryptjs";
import AdminModel from '../admin/admin.model';
import { AdminServices } from '../admin/admin.service';

const createClient = async (req: Request, res: Response) => {
    try {
        const parsedData = await ClientValidation.clientValidationSchema.parseAsync({
            body: req.body,
        });

  
        const client = await ClientModel.findOne({email: req.body.email});

        if(client){
          return res.status(409).json({
                success: false,
                message: 'Your email clready exist!',
            });
        }

        const result = await ClientServices.createClient(parsedData.body);


        res.status(201).json({
            success: true,
            message: 'Client created successfully',
            data: result,
        });
    } catch (error) {
      console.log('error', error)
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

const loginClient = async (req: Request, res: Response) => {
    try {
        const parsedData = await ClientValidation.clientLoginValidationSchema.parseAsync({
            body: req.body,
        });


        const { email, password } = parsedData.body;


        const isAdmin = await AdminModel.findOne({email});

        if(isAdmin){

          
        const result = await AdminServices.loginAdmin(email, password);

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            data: result,
        });

        }else{
        const result = await ClientServices.loginClient(email, password);

        res.status(200).json({
            success: true,
            message: 'Client logged in successfully',
            data: result,
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

const getAllClient = async (req: Request, res: Response) => {
    try {
      const result = await ClientServices.getAllClient();
      if (result.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Clients fetched successfully',
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No client found',
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
      
      const result = await ClientServices.getClientById(trimmedId);
      
      if (result) {
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
      
      const parsedData = await ClientValidation.clientUpdateValidationSchema.parseAsync({
        body: req.body,
    });
      
      const result = await ClientServices.updateClient(trimmedId, parsedData.body);
      
      if (result) {
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

        const parsedData = await ClientValidation.clientUpdateValidationSchema.parseAsync({
            body: req.body,
        });

    
        const result = await ClientServices.updateClientProfile(trimmedId, parsedData.body);

        if (result) {
          const { password, ...safeResult } = result.toObject ? result.toObject() : result;

            res.status(200).json({
                success: true,
                message: 'Client profile updated successfully',
                data: safeResult,
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

    const client = await ClientModel.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, client.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashedPassword;
    await client.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
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
      
      const result = await ClientServices.deleteClient(trimmedId);
      
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

export const ClientsControllers = {
    createClient,
    loginClient,
    getAllClient,
    getClientById,
    updateClient,
    updateClientProfile,
    deleteClient
};


// <====Client Login===>
// email: sha@gmail.com
// password: 123456Qa


// <====Admin Login===>
// email: admin@gmail.com
// password: admin1234