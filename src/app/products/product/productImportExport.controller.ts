import { Request, Response } from 'express';
import { ProductImportExportService } from './productImportExport.service';
import { OrderErrorHandler, asyncHandler } from '../../order/orderErrorHandler';
import { AuthRequest } from '../../../middlewares/auth.middleware';

// Simple file upload middleware without multer for now
export const uploadMiddleware = (req: any, res: any, next: any) => {
  // This would be implemented with proper file upload handling
  // For now, we'll assume the file is available in req.file
  next();
};

const importProducts = asyncHandler(async (req: any, res: Response) => {
  if (!req.file) {
    throw OrderErrorHandler.createError(
      'MISSING_FILE',
      'No file uploaded',
      400
    );
  }

  const { file } = req;
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  
  let result;
  
  if (fileExtension === 'csv') {
    result = await ProductImportExportService.importFromCSV(file.buffer);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    result = await ProductImportExportService.importFromExcel(file.buffer);
  } else {
    throw OrderErrorHandler.createError(
      'INVALID_FILE_TYPE',
      'Unsupported file type. Please upload CSV or Excel files.',
      400
    );
  }

  res.status(200).json({
    success: result.success,
    message: result.success 
      ? 'Products imported successfully' 
      : 'Import completed with errors',
    data: result,
  });
});

const exportProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    format = 'csv',
    fields,
    status,
    categories,
    featured,
    startDate,
    endDate,
    includeVariants = false,
    includeAnalytics = false
  } = req.query;

  const options = {
    format: format as 'csv' | 'xlsx' | 'json',
    fields: fields ? (fields as string).split(',') : undefined,
    filters: {
      status: status ? (status as string).split(',') : undefined,
      categories: categories ? (categories as string).split(',') : undefined,
      featured: featured ? featured === 'true' : undefined,
      dateRange: startDate && endDate ? {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      } : undefined
    },
    includeVariants: includeVariants === 'true',
    includeAnalytics: includeAnalytics === 'true'
  };

  let buffer: Buffer;
  let contentType: string;
  let filename: string;

  switch (options.format) {
    case 'csv':
      buffer = await ProductImportExportService.exportToCSV(options);
      contentType = 'text/csv';
      filename = `products_${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'xlsx':
      buffer = await ProductImportExportService.exportToExcel(options);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      filename = `products_${new Date().toISOString().split('T')[0]}.xlsx`;
      break;
    case 'json':
      buffer = await ProductImportExportService.exportToJSON(options);
      contentType = 'application/json';
      filename = `products_${new Date().toISOString().split('T')[0]}.json`;
      break;
    default:
      throw OrderErrorHandler.createError(
        'INVALID_FORMAT',
        'Invalid export format. Supported formats: csv, xlsx, json',
        400
      );
  }

  res.set({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': buffer.length.toString()
  });

  res.send(buffer);
});

const getImportTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { format = 'csv' } = req.query;

  if (!['csv', 'xlsx'].includes(format as string)) {
    throw OrderErrorHandler.createError(
      'INVALID_FORMAT',
      'Invalid template format. Supported formats: csv, xlsx',
      400
    );
  }

  const buffer = await ProductImportExportService.getImportTemplate(format as 'csv' | 'xlsx');
  const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const filename = `product_import_template.${format}`;

  res.set({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': buffer.length.toString()
  });

  res.send(buffer);
});

const getExportOptions = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    formats: ['csv', 'xlsx', 'json'],
    fields: [
      'id', 'title', 'description', 'shortDescription', 'primaryImage', 'optionalImages',
      'regularPrice', 'discountPrice', 'costPrice', 'sku', 'barcode', 'weight', 'dimensions',
      'status', 'featured', 'tags', 'categories', 'colors', 'sizes', 'totalStock',
      'availableStock', 'lowStockThreshold', 'trackInventory', 'seoTitle', 'seoDescription',
      'seoKeywords', 'slug', 'views', 'purchases', 'averageRating', 'totalReviews',
      'wishlistCount', 'createdAt', 'updatedAt'
    ],
    statusOptions: ['active', 'inactive', 'draft', 'archived'],
    filters: {
      status: 'Filter by product status',
      categories: 'Filter by category IDs (comma-separated)',
      featured: 'Filter by featured products (true/false)',
      startDate: 'Filter by creation date start (ISO format)',
      endDate: 'Filter by creation date end (ISO format)'
    },
    options: {
      includeVariants: 'Include product variants in export',
      includeAnalytics: 'Include analytics data in export'
    }
  };

  res.status(200).json({
    success: true,
    message: 'Export options retrieved successfully',
    data: options,
  });
});

const validateImportFile = asyncHandler(async (req: any, res: Response) => {
  if (!req.file) {
    throw OrderErrorHandler.createError(
      'MISSING_FILE',
      'No file uploaded',
      400
    );
  }

  const { file } = req;
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  
  if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
    throw OrderErrorHandler.createError(
      'INVALID_FILE_TYPE',
      'Unsupported file type. Please upload CSV or Excel files.',
      400
    );
  }

  // Basic validation - check if file has content
  if (file.buffer.length === 0) {
    throw OrderErrorHandler.createError(
      'EMPTY_FILE',
      'Uploaded file is empty',
      400
    );
  }

  // Check file size
  if (file.buffer.length > 10 * 1024 * 1024) { // 10MB
    throw OrderErrorHandler.createError(
      'FILE_TOO_LARGE',
      'File size exceeds 10MB limit',
      400
    );
  }

  res.status(200).json({
    success: true,
    message: 'File validation passed',
    data: {
      filename: file.originalname,
      size: file.buffer.length,
      type: file.mimetype,
      extension: fileExtension
    },
  });
});

const getImportHistory = asyncHandler(async (req: Request, res: Response) => {
  // This would typically be stored in a separate collection
  // For now, return a placeholder response
  res.status(200).json({
    success: true,
    message: 'Import history retrieved successfully',
    data: {
      imports: [],
      total: 0,
      page: 1,
      totalPages: 0
    },
  });
});

const getExportHistory = asyncHandler(async (req: Request, res: Response) => {
  // This would typically be stored in a separate collection
  // For now, return a placeholder response
  res.status(200).json({
    success: true,
    message: 'Export history retrieved successfully',
    data: {
      exports: [],
      total: 0,
      page: 1,
      totalPages: 0
    },
  });
});

export const ProductImportExportControllers = {
  importProducts,
  exportProducts,
  getImportTemplate,
  getExportOptions,
  validateImportFile,
  getImportHistory,
  getExportHistory,
};
