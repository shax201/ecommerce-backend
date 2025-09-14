import { Response } from 'express';
import { ValidationError } from 'express-validator';
import mongoose from 'mongoose';

export interface OrderError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

export class OrderErrorHandler {
  static handleError(error: any, res: Response): void {
    console.error('Order Error:', error);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        code: 'VALIDATION_ERROR'
      });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        code: 'DUPLICATE_ERROR'
      });
    }

    // Mongoose cast error (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        code: 'INVALID_ID'
      });
    }

    // Express validator errors
    if (error.type === 'validation') {
      const validationErrors = error.errors.map((err: ValidationError) => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        code: 'VALIDATION_ERROR'
      });
    }

    // Custom order errors
    if (error instanceof OrderError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
        details: error.details
      });
    }

    // Default server error
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }

  static createError(
    code: string,
    message: string,
    statusCode: number = 400,
    details?: any
  ): OrderError {
    return {
      code,
      message,
      details,
      statusCode
    };
  }

  static validateObjectId(id: string, fieldName: string = 'ID'): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw this.createError(
        'INVALID_ID',
        `Invalid ${fieldName} format`,
        400
      );
    }
  }

  static validateOrderStatus(status: string): void {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw this.createError(
        'INVALID_STATUS',
        `Invalid order status. Must be one of: ${validStatuses.join(', ')}`,
        400
      );
    }
  }

  static validatePaymentMethod(method: string): void {
    const validMethods = ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'];
    if (!validMethods.includes(method)) {
      throw this.createError(
        'INVALID_PAYMENT_METHOD',
        `Invalid payment method. Must be one of: ${validMethods.join(', ')}`,
        400
      );
    }
  }

  static handleNotFound(resource: string, id: string): OrderError {
    return this.createError(
      'NOT_FOUND',
      `${resource} with ID ${id} not found`,
      404
    );
  }

  static handleUnauthorized(message: string = 'Unauthorized access'): OrderError {
    return this.createError(
      'UNAUTHORIZED',
      message,
      401
    );
  }

  static handleForbidden(message: string = 'Access forbidden'): OrderError {
    return this.createError(
      'FORBIDDEN',
      message,
      403
    );
  }

  static handleConflict(message: string, details?: any): OrderError {
    return this.createError(
      'CONFLICT',
      message,
      409,
      details
    );
  }

  static handleBadRequest(message: string, details?: any): OrderError {
    return this.createError(
      'BAD_REQUEST',
      message,
      400,
      details
    );
  }
}

// Async error wrapper for controllers
export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      OrderErrorHandler.handleError(error, res);
    });
  };
};
