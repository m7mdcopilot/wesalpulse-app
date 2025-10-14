import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  stack?: string;
}

/**
 * Global error handling middleware
 */
export class ErrorHandler {
  /**
   * Handle different types of errors and return appropriate responses
   */
  static handleError(error: any, req?: NextRequest): NextResponse {
    console.error('Error occurred:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return this.createValidationErrorResponse(error);
    }

    if (error.name === 'CastError') {
      return this.createCastErrorResponse(error);
    }

    if (error.code === 11000) {
      return this.createDuplicateKeyErrorResponse(error);
    }

    if (error.name === 'NotFoundError') {
      return this.createNotFoundResponse(error.message);
    }

    if (error.name === 'UnauthorizedError') {
      return this.createUnauthorizedResponse(error.message);
    }

    if (error.name === 'ForbiddenError') {
      return this.createForbiddenResponse(error.message);
    }

    // Handle generic errors
    return this.createGenericErrorResponse(error);
  }

  /**
   * Create validation error response
   */
  private static createValidationErrorResponse(error: any): NextResponse {
    const response: ErrorResponse = {
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors || error.message
    };

    return NextResponse.json(response, { status: 400 });
  }

  /**
   * Create cast error response
   */
  private static createCastErrorResponse(error: any): NextResponse {
    const response: ErrorResponse = {
      error: 'Bad Request',
      message: 'Invalid data format',
      details: {
        field: error.path,
        value: error.value,
        type: error.kind
      }
    };

    return NextResponse.json(response, { status: 400 });
  }

  /**
   * Create duplicate key error response
   */
  private static createDuplicateKeyErrorResponse(error: any): NextResponse {
    const field = Object.keys(error.keyPattern)[0];
    const response: ErrorResponse = {
      error: 'Conflict',
      message: `${field} already exists`,
      details: {
        field,
        value: error.keyValue[field]
      }
    };

    return NextResponse.json(response, { status: 409 });
  }

  /**
   * Create not found response
   */
  private static createNotFoundResponse(message: string = 'Resource not found'): NextResponse {
    const response: ErrorResponse = {
      error: 'Not Found',
      message
    };

    return NextResponse.json(response, { status: 404 });
  }

  /**
   * Create unauthorized response
   */
  private static createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
    const response: ErrorResponse = {
      error: 'Unauthorized',
      message
    };

    return NextResponse.json(response, { status: 401 });
  }

  /**
   * Create forbidden response
   */
  private static createForbiddenResponse(message: string = 'Forbidden'): NextResponse {
    const response: ErrorResponse = {
      error: 'Forbidden',
      message
    };

    return NextResponse.json(response, { status: 403 });
  }

  /**
   * Create generic error response
   */
  private static createGenericErrorResponse(error: any): NextResponse {
    const response: ErrorResponse = {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
      response.stack = error.stack;
    }

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * Async error wrapper for route handlers with MongoDB connection check
 */
export function asyncHandler(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Ensure MongoDB connection
      await connectDB();
      
      // Call the handler
      return await handler(req, context);
    } catch (error) {
      return ErrorHandler.handleError(error, req);
    }
  };
}

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(message: string, public errors?: any[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends Error {
  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Error logging utility
 */
export class ErrorLogger {
  /**
   * Log error with context
   */
  static logError(error: any, context: any = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    };

    console.error('Error Log:', JSON.stringify(errorData, null, 2));

    // Here you could also send to external logging services
    // like Sentry, LogRocket, etc.
  }

  /**
   * Log API request error
   */
  static logApiError(req: NextRequest, error: any) {
    const url = new URL(req.url);
    const context = {
      method: req.method,
      url: url.pathname,
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    };

    this.logError(error, context);
  }
}