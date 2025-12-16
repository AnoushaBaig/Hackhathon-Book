"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    let errorResponse;
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
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
function getErrorCode(statusCode) {
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
//# sourceMappingURL=errorHandler.js.map