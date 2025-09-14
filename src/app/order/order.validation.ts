import { body, param, query } from "express-validator";

// Order creation validation
export const createOrderValidation = [
  body("productID")
    .isArray({ min: 1 })
    .withMessage("At least one product is required")
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("ProductID must be an array");
      }
      // Validate each product ID is a valid ObjectId format
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      for (const id of value) {
        if (typeof id !== 'string' || !objectIdRegex.test(id)) {
          throw new Error("Invalid product ID format");
        }
      }
      return true;
    }),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
  body("paymentMethod")
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'])
    .withMessage("Invalid payment method"),
  body("shipping")
    .isMongoId()
    .withMessage("Invalid shipping address ID"),
  body("estimatedDeliveryDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid delivery date format"),
];

// Order update validation
export const updateOrderValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),
  body("trackingSteps")
    .optional()
    .isArray()
    .withMessage("Tracking steps must be an array"),
  body("trackingSteps.*")
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage("Invalid tracking step"),
  body("paymentStatus")
    .optional()
    .isBoolean()
    .withMessage("Payment status must be boolean"),
  body("estimatedDeliveryDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid delivery date format"),
];

// Order query validation
export const orderQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage("Invalid status filter"),
  query("search")
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),
  query("category")
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category filter must be between 1 and 50 characters"),
  query("sort")
    .optional()
    .isIn(['date-desc', 'date-asc', 'total-desc', 'total-asc'])
    .withMessage("Invalid sort option"),
];

// Order ID validation
export const orderIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),
];

// Order status update validation
export const updateOrderStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),
  body("status")
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage("Invalid order status"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
];
