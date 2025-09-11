import { body, query } from 'express-validator';

// Dynamic Menu Validation
export const createDynamicMenuValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Menu slug is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Menu slug must be between 1 and 50 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const updateDynamicMenuValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Menu name cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('slug')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Menu slug cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Menu slug must be between 1 and 50 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const getDynamicMenusValidation = [
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const createDynamicMenuItemValidation = [
  body('label')
    .trim()
    .notEmpty()
    .withMessage('Item label is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Item label must be between 1 and 100 characters'),
  
  body('url')
    .trim()
    .notEmpty()
    .withMessage('Item URL is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Item URL must be between 1 and 500 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon must not exceed 50 characters'),
  
  body('isExternal')
    .optional()
    .isBoolean()
    .withMessage('isExternal must be a boolean'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  
  body('parentId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Parent ID must be a positive integer')
];

export const updateDynamicMenuItemValidation = [
  body('label')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item label cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Item label must be between 1 and 100 characters'),
  
  body('url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item URL cannot be empty')
    .isLength({ min: 1, max: 500 })
    .withMessage('Item URL must be between 1 and 500 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon must not exceed 50 characters'),
  
  body('isExternal')
    .optional()
    .isBoolean()
    .withMessage('isExternal must be a boolean'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  
  body('parentId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Parent ID must be a positive integer')
];

export const reorderDynamicMenuItemsValidation = [
  body('updates')
    .isArray({ min: 1 })
    .withMessage('Updates must be a non-empty array'),
  
  body('updates.*.id')
    .isInt({ min: 1 })
    .withMessage('Each update must have a valid ID'),
  
  body('updates.*.order')
    .isInt({ min: 1 })
    .withMessage('Each update must have a valid order')
];
