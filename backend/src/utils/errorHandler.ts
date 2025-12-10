// Error handling infrastructure
import { Request, Response, NextFunction } from 'express';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
export interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  let errorResponse: ErrorResponse;

  // Handle AppError (operational errors)
  if (err instanceof AppError) {
    errorResponse = {
      success: false,
      error: {
        code: getErrorCode(err.statusCode),
        message: err.message,
      },
    };

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    errorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
    };

    res.status(400).json(errorResponse);
    return;
  }

  // Handle database errors
  if (err.name === 'MongoError' || err.name === 'SequelizeError') {
    errorResponse = {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: err.message,
      },
    };

    res.status(500).json(errorResponse);
    return;
  }

  // Handle default errors
  errorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };

  console.error('Unhandled error:', err);
  res.status(500).json(errorResponse);
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Helper function to get error code based on status
function getErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'VALIDATION_ERROR';
    case 500:
      return 'INTERNAL_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
}