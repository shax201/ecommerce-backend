import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation for creating courier credentials
export const createCourierCredentialsValidation = [
  body('courier')
    .isIn(['pathao', 'steadfast'])
    .withMessage('Courier must be either pathao or steadfast'),
  
  body('credentials')
    .isObject()
    .withMessage('Credentials must be an object'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  // Pathao specific validation
  body('credentials.client_id')
    .if(body('courier').equals('pathao'))
    .notEmpty()
    .withMessage('client_id is required for Pathao'),
  
  body('credentials.client_secret')
    .if(body('courier').equals('pathao'))
    .notEmpty()
    .withMessage('client_secret is required for Pathao'),
  
  body('credentials.username')
    .if(body('courier').equals('pathao'))
    .notEmpty()
    .withMessage('username is required for Pathao'),
  
  body('credentials.password')
    .if(body('courier').equals('pathao'))
    .notEmpty()
    .withMessage('password is required for Pathao'),
  
  body('credentials.base_url')
    .if(body('courier').equals('pathao'))
    .isURL()
    .withMessage('base_url must be a valid URL for Pathao'),
  
  // Steadfast specific validation
  body('credentials.api_key')
    .if(body('courier').equals('steadfast'))
    .notEmpty()
    .withMessage('api_key is required for Steadfast'),
  
  body('credentials.secret_key')
    .if(body('courier').equals('steadfast'))
    .notEmpty()
    .withMessage('secret_key is required for Steadfast'),
  
  body('credentials.base_url')
    .if(body('courier').equals('steadfast'))
    .isURL()
    .withMessage('base_url must be a valid URL for Steadfast'),
];

// Validation for updating courier credentials
export const updateCourierCredentialsValidation = [
  param('courier')
    .isIn(['pathao', 'steadfast'])
    .withMessage('Courier must be either pathao or steadfast'),
  
  body('credentials')
    .optional()
    .isObject()
    .withMessage('Credentials must be an object'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

// Validation for courier parameter
export const courierParamValidation = [
  param('courier')
    .isIn(['pathao', 'steadfast'])
    .withMessage('Courier must be either pathao or steadfast'),
];

// Validation for order data
export const courierOrderValidation = [
  body('orderNumber')
    .notEmpty()
    .withMessage('Order number is required'),
  
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required'),
  
  body('customerPhone')
    .notEmpty()
    .withMessage('Customer phone is required'),
  
  body('customerAddress')
    .notEmpty()
    .withMessage('Customer address is required'),
  
  body('customerCity')
    .notEmpty()
    .withMessage('Customer city is required'),
  
  body('customerArea')
    .notEmpty()
    .withMessage('Customer area is required'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  
  body('items.*.name')
    .notEmpty()
    .withMessage('Item name is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  
  body('items.*.weight')
    .isFloat({ min: 0 })
    .withMessage('Item weight must be non-negative'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Item price must be non-negative'),
  
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be non-negative'),
];

// Validation for bulk orders
export const courierBulkOrderValidation = [
  body('orders')
    .isArray({ min: 1 })
    .withMessage('At least one order is required'),
  
  body('orders.*.orderNumber')
    .notEmpty()
    .withMessage('Order number is required for each order'),
  
  body('orders.*.customerName')
    .notEmpty()
    .withMessage('Customer name is required for each order'),
  
  body('orders.*.customerPhone')
    .notEmpty()
    .withMessage('Customer phone is required for each order'),
  
  body('orders.*.customerAddress')
    .notEmpty()
    .withMessage('Customer address is required for each order'),
  
  body('orders.*.customerCity')
    .notEmpty()
    .withMessage('Customer city is required for each order'),
  
  body('orders.*.customerArea')
    .notEmpty()
    .withMessage('Customer area is required for each order'),
];

// Validation for status check
export const courierStatusValidation = [
  param('consignmentId')
    .notEmpty()
    .withMessage('Consignment ID is required'),
];

// Validation for price calculation
export const courierPriceValidation = [
  body('item_type')
    .optional()
    .isInt()
    .withMessage('Item type must be an integer'),
  
  body('item_weight')
    .isFloat({ min: 0 })
    .withMessage('Item weight must be non-negative'),
  
  body('item_quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  
  body('delivery_type')
    .optional()
    .isInt()
    .withMessage('Delivery type must be an integer'),
  
  body('recipient_city')
    .notEmpty()
    .withMessage('Recipient city is required'),
  
  body('recipient_zone')
    .notEmpty()
    .withMessage('Recipient zone is required'),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
