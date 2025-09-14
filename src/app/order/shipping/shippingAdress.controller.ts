import { Request, Response } from 'express';
import { ShippingAddressServices } from './shippingAdress.service';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { decodeBearerTokenAndGetUserId } from '../../../utils/jwt';
import ClientModel from '../../user/client/client.model';

const createShippingAddress = async (req: AuthRequest, res: Response) => {
    try {
      let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
      if (!userId) {
        userId = req.user?.userId as string | undefined;
      }
      if (!userId && req.user?.email) {
        const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
        if (client?._id) userId = String(client._id);
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User not found',
        });
      }

      const shippingData = { ...req.body, user: userId };
      const newAddress = await ShippingAddressServices.createShippingAddress(shippingData);

      res.status(201).json({
        success: true,
        message: "Shipping address created successfully",
        data: newAddress,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to create shipping address",
        error: error.message,
      });
    }
}

const getShippingAddress = async (req: AuthRequest, res: Response) => {
  try {
    let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
    if (!userId) {
      userId = req.user?.userId as string | undefined;
    }
    if (!userId && req.user?.email) {
      const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
      if (client?._id) userId = String(client._id);
    }

    const result = await ShippingAddressServices.getShippingAddress(userId);
    res.status(200).json({
      success: true,
      message: 'Shipping addresses fetched successfully',
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

const getShippingAddressById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;


    const result = await ShippingAddressServices.getShippingAddressById(id);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Shipping Address fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No shipping address found with that ID',
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

const updateShippingAddress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedAddress =
        await ShippingAddressServices.updateShippingAddress(id, updatedData);

      if (!updatedAddress) {
        return res.status(404).json({
          success: false,
          message: "Shipping address not found",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "Shipping address updated successfully",
        data: updatedAddress,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update shipping address",
        error: error.message,
      });
    }
  }


 const setDefaultShippingAddress =  async (req: AuthRequest, res: Response) => {
    try {
      let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
      if (!userId) {
        userId = req.user?.userId as string | undefined;
      }
      if (!userId && req.user?.email) {
        const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
        if (client?._id) userId = String(client._id);
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User not found',
        });
      }

      const { id } = req.params;
      const updatedAddress = await ShippingAddressServices.setDefaultShippingAddress(id, userId);

      res.status(200).json({
        success: true,
        message: "Default shipping address updated successfully",
        data: updatedAddress,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update default shipping address",
        error: error.message,
      });
    }
  }

const  deleteShippingAddress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedAddress = await ShippingAddressServices.deleteShippingAddress(id);

      if (!deletedAddress) {
        return res.status(404).json({
          success: false,
          message: "Shipping address not found",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "Shipping address deleted successfully",
        data: deletedAddress,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to delete shipping address",
        error: error.message,
      });
    }
  };


export const ShippingAddressControllers = {
  getShippingAddress,
  getShippingAddressById,
  createShippingAddress,
  updateShippingAddress,
  setDefaultShippingAddress,
  deleteShippingAddress
};