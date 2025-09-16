import express from 'express';
import { ProductImportExportControllers, uploadMiddleware } from './productImportExport.controller';
import { authMiddleware, authorizeRoles } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';
import { query, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const exportQueryValidation = [
  query('format').optional().isIn(['csv', 'xlsx', 'json']).withMessage('Format must be csv, xlsx, or json'),
  query('fields').optional().isString().withMessage('Fields must be a comma-separated string'),
  query('status').optional().isString().withMessage('Status must be a comma-separated string'),
  query('categories').optional().isString().withMessage('Categories must be a comma-separated string'),
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  query('startDate').optional().isISO8601().withMessage('Start date must be in ISO format'),
  query('endDate').optional().isISO8601().withMessage('End date must be in ISO format'),
  query('includeVariants').optional().isBoolean().withMessage('Include variants must be a boolean'),
  query('includeAnalytics').optional().isBoolean().withMessage('Include analytics must be a boolean'),
];

const templateQueryValidation = [
  query('format').optional().isIn(['csv', 'xlsx']).withMessage('Format must be csv or xlsx'),
];

// Public routes
router.get('/export', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  exportQueryValidation, 
  ProductImportExportControllers.exportProducts
);
router.get('/template', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  templateQueryValidation, 
  ProductImportExportControllers.getImportTemplate
);
router.get('/export-options', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  ProductImportExportControllers.getExportOptions
);

// Protected routes (require authentication and permissions)
router.post('/import', 
  authMiddleware, 
  requirePermission('products', 'create'), 
  uploadMiddleware, 
  ProductImportExportControllers.importProducts
);
router.post('/validate', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  uploadMiddleware, 
  ProductImportExportControllers.validateImportFile
);

// Admin routes (require admin role and permissions)
router.get('/import-history', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  ProductImportExportControllers.getImportHistory
);
router.get('/export-history', 
  authMiddleware, 
  requirePermission('products', 'read'), 
  ProductImportExportControllers.getExportHistory
);

export const ProductImportExportRoutes = router;
