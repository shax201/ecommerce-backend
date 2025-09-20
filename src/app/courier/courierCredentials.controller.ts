import { Request, Response } from 'express';
import { CourierCredentialsService } from './courierCredentials.service';
import { ICreateCourierCredentials, IUpdateCourierCredentials } from './courierCredentials.interface';

const courierCredentialsService = new CourierCredentialsService();

export class CourierCredentialsController {
  async createCredentials(req: Request, res: Response): Promise<void> {
    try {
      const data: ICreateCourierCredentials = req.body;
      const credentials = await courierCredentialsService.createCredentials(data);
      
      res.status(201).json({
        success: true,
        message: `${data.courier} credentials created successfully`,
        data: credentials
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create credentials',
        error: error.message
      });
    }
  }

  async getCredentialsByCourier(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      
      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const credentials = await courierCredentialsService.getCredentialsByCourier(courier as 'pathao' | 'steadfast');
      
      if (!credentials) {
        res.status(404).json({
          success: false,
          message: `No active credentials found for ${courier}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: credentials
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch credentials',
        error: error.message
      });
    }
  }

  async getAllCredentials(req: Request, res: Response): Promise<void> {
    try {
      const credentials = await courierCredentialsService.getAllCredentials();
      
      res.status(200).json({
        success: true,
        data: credentials
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch credentials',
        error: error.message
      });
    }
  }

  async updateCredentials(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      const data: IUpdateCourierCredentials = req.body;
      
      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const credentials = await courierCredentialsService.updateCredentials(
        courier as 'pathao' | 'steadfast', 
        data
      );
      
      if (!credentials) {
        res.status(404).json({
          success: false,
          message: `No credentials found for ${courier}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${courier} credentials updated successfully`,
        data: credentials
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update credentials',
        error: error.message
      });
    }
  }

  async deleteCredentials(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      
      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      const deleted = await courierCredentialsService.deleteCredentials(courier as 'pathao' | 'steadfast');
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `No credentials found for ${courier}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${courier} credentials deleted successfully`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete credentials',
        error: error.message
      });
    }
  }

  async toggleCredentialsStatus(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      const { action } = req.body; // 'activate' or 'deactivate'
      
      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      if (!['activate', 'deactivate'].includes(action)) {
        res.status(400).json({
          success: false,
          message: 'Invalid action. Must be activate or deactivate'
        });
        return;
      }

      let credentials;
      if (action === 'activate') {
        credentials = await courierCredentialsService.activateCredentials(courier as 'pathao' | 'steadfast');
      } else {
        credentials = await courierCredentialsService.deactivateCredentials(courier as 'pathao' | 'steadfast');
      }
      
      if (!credentials) {
        res.status(404).json({
          success: false,
          message: `No credentials found for ${courier}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${courier} credentials ${action}d successfully`,
        data: credentials
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to toggle credentials status',
        error: error.message
      });
    }
  }

  async getActiveCouriers(req: Request, res: Response): Promise<void> {
    try {
      const couriers = await courierCredentialsService.getActiveCouriers();
      
      res.status(200).json({
        success: true,
        data: couriers
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch active couriers',
        error: error.message
      });
    }
  }
}
