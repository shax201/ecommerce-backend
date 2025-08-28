import { Request, Response } from 'express';
import { CatagoryServices } from './catagory.service';
import { TCatagory } from './catagory.interface';

const getCatagory = async (req: Request, res: Response) => {
  try {
    const result = await CatagoryServices.getCatagoryFromDB();
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No catagory found',
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

const getSingleCatagory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CatagoryServices.getSingleCatagoryFromDB(id);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Catagory fetched successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No catagory found with that ID',
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

const createCatagory = async (req: Request, res: Response) => {
  try {
    const catagoryData = req.body;
    
    const result = await CatagoryServices.createCatagoryIntoDB(catagoryData as TCatagory);
    
    res.status(201).json({
      success: true,
      message: 'Catagory created successfully',
      data: result,
    });
  } catch (error: unknown) {
    // Check if it's the "already exists" error from our service
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Check for duplicate key error (MongoDB error code 11000)
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { name: string }).name === 'MongoServerError' &&
      (error as { code: number }).code === 11000
    ) {
      const field = Object.keys(
        (error as { keyPattern: Record<string, unknown> }).keyPattern,
      )[0];
      const value = (error as { keyValue: Record<string, unknown> }).keyValue[
        field
      ];

      res.status(409).json({
        success: false,
        message: `A catagory with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating catagory',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const updateCatagory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateCatagoryData = req.body;
    
    const result = await CatagoryServices.updateCatagoryIntoDB(id, updateCatagoryData as Partial<TCatagory>);
    
    res.status(200).json({
      success: true,
      message: 'Catagory updated successfully',
      data: result,
    });
  } catch (error: unknown) {
    // Check if it's the "not found" error from our service
    if (
      error instanceof Error &&
      error.message.includes('No catagory document found')
    ) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Check for duplicate key error (MongoDB error code 11000)
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { name: string }).name === 'MongoServerError' &&
      (error as { code: number }).code === 11000
    ) {
      const field = Object.keys(
        (error as { keyPattern: Record<string, unknown> }).keyPattern,
      )[0];
      const value = (error as { keyValue: Record<string, unknown> }).keyValue[
        field
      ];

      res.status(409).json({
        success: false,
        message: `A catagory with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating catagory',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const deleteCatagory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CatagoryServices.deleteCatagoryFromDB(id);
    
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Catagory not found',
      });
      return;
    } 
    
    res.status(200).json({
      success: true,
      message: 'Catagory deleted successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('Cannot delete a category that has sub-categories')
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting catagory',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const CatagoryControllers = {
  getCatagory,
  getSingleCatagory,
  createCatagory,
  updateCatagory,
  deleteCatagory,
};