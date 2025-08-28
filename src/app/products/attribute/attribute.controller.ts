import { Request, Response } from 'express';
import { ColorServices, SizeServices } from './attribute.service';
import { TColor, TSize, TColorPayload, TSizePayload } from './attribute.interface';

// Color Controllers
const getColors = async (req: Request, res: Response) => {
  try {
    const result = await ColorServices.getColorsFromDB();
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Colors fetched successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No colors found',
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

const getSingleColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ColorServices.getSingleColorFromDB(id);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Color fetched successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No color found with that ID',
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

const createColor = async (req: Request, res: Response) => {
  try {
    const colorData = req.body;
    
    const result = await ColorServices.createColorIntoDB(colorData as TColorPayload);
    
    const isMultiple = result.length > 1;
    const message = isMultiple 
      ? `${result.length} colors created successfully`
      : 'Color created successfully';
    
    res.status(201).json({
      success: true,
      message,
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('already exist')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message.includes('must be provided')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message.includes('array is required')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

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
        message: `A color with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating color(s)',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const updateColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateColorData = req.body;
    
    const result = await ColorServices.updateColorIntoDB(id, updateColorData as Partial<TColor>);
    
    res.status(200).json({
      success: true,
      message: 'Color updated successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('No color document found')
    ) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
      return;
    }

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
        message: `A color with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating color',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const deleteColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ColorServices.deleteColorFromDB(id);
    
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Color not found',
      });
      return;
    } 
    
    res.status(200).json({
      success: true,
      message: 'Color deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting color',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Size Controllers
const getSizes = async (req: Request, res: Response) => {
  try {
    const result = await SizeServices.getSizesFromDB();
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Sizes fetched successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No sizes found',
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

const getSingleSize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SizeServices.getSingleSizeFromDB(id);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Size fetched successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No size found with that ID',
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

const createSize = async (req: Request, res: Response) => {
  try {
    const sizeData = req.body;
    
    const result = await SizeServices.createSizeIntoDB(sizeData as TSizePayload);
    
    const isMultiple = result.length > 1;
    const message = isMultiple 
      ? `${result.length} sizes created successfully`
      : 'Size created successfully';
    
    res.status(201).json({
      success: true,
      message,
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('already exist')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message.includes('must be provided')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message.includes('array is required')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

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
        message: `A size with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating size(s)',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const updateSize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateSizeData = req.body;
    
    const result = await SizeServices.updateSizeIntoDB(id, updateSizeData as Partial<TSize>);
    
    res.status(200).json({
      success: true,
      message: 'Size updated successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('No size document found')
    ) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
      return;
    }

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
        message: `A size with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating size',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const deleteSize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SizeServices.deleteSizeFromDB(id);
    
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Size not found',
      });
      return;
    } 
    
    res.status(200).json({
      success: true,
      message: 'Size deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting size',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const ColorControllers = {
  getColors,
  getSingleColor,
  createColor,
  updateColor,
  deleteColor,
};

export const SizeControllers = {
  getSizes,
  getSingleSize,
  createSize,
  updateSize,
  deleteSize,
};