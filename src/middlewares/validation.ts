import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Generic validation middleware using Zod schemas
 */
export function validateMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest): Promise<NextResponse | T> => {
    try {
      const body = await req.json();
      const result = schema.safeParse(body);

      if (!result.success) {
        const errorDetails = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return NextResponse.json(
          { 
            error: 'Validation Error', 
            message: 'Invalid request data',
            details: errorDetails 
          },
          { status: 400 }
        );
      }

      return result.data;
    } catch (error) {
      console.error('Validation middleware error:', error);
      
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid JSON format' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Validation failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Query parameter validation middleware
 */
export function validateQueryMiddleware<T>(schema: z.ZodSchema<T>) {
  return (req: NextRequest): T | NextResponse => {
    try {
      const { searchParams } = new URL(req.url);
      const params: Record<string, string> = {};
      
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      const result = schema.safeParse(params);

      if (!result.success) {
        const errorDetails = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return NextResponse.json(
          { 
            error: 'Validation Error', 
            message: 'Invalid query parameters',
            details: errorDetails 
          },
          { status: 400 }
        );
      }

      return result.data;
    } catch (error) {
      console.error('Query validation error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Query validation failed' },
        { status: 500 }
      );
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  // Pagination schema
  pagination: z.object({
    page: z.string().transform(val => parseInt(val, 10)).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).default('10')
  }),

  // ID schema
  id: z.object({
    id: z.string().min(1, 'ID is required')
  }),

  // Search schema
  search: z.object({
    search: z.string().optional()
  }),

  // Date range schema
  dateRange: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
};

// Company validation schemas
export const companySchemas = {
  create: z.object({
    name: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
    domain: z.string().min(1, 'Domain is required').max(50, 'Domain too long'),
    settings: z.object({
      general: z.object({
        timezone: z.string().default('UTC'),
        businessHours: z.object({
          start: z.string().default('09:00'),
          end: z.string().default('17:00'),
          days: z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5])
        }).default({}),
        language: z.string().default('en'),
        currency: z.string().default('USD')
      }).default({}),
      users: z.object({
        maxUsers: z.number().min(1).default(10),
        defaultRole: z.string().default('agent'),
        requireTwoFactor: z.boolean().default(false)
      }).default({}),
      notifications: z.object({
        email: z.boolean().default(true),
        sms: z.boolean().default(true),
        push: z.boolean().default(true),
        webhook: z.string().default('')
      }).default({})
    }).default({})
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    domain: z.string().min(1).max(50).optional(),
    settings: z.object({
      general: z.object({
        timezone: z.string().optional(),
        businessHours: z.object({
          start: z.string().optional(),
          end: z.string().optional(),
          days: z.array(z.number().min(0).max(6)).optional()
        }).optional(),
        language: z.string().optional(),
        currency: z.string().optional()
      }).optional(),
      users: z.object({
        maxUsers: z.number().min(1).optional(),
        defaultRole: z.string().optional(),
        requireTwoFactor: z.boolean().optional()
      }).optional(),
      notifications: z.object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
        push: z.boolean().optional(),
        webhook: z.string().optional()
      }).optional()
    }).optional()
  })
};

// User validation schemas
export const userSchemas = {
  create: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    role: z.enum(['admin', 'manager', 'supervisor', 'agent']).default('agent'),
    department: z.string().min(1, 'Department is required'),
    status: z.enum(['active', 'inactive', 'suspended']).default('active'),
    profile: z.object({
      avatar: z.string().default(''),
      phone: z.string().default(''),
      extension: z.string().default(''),
      location: z.string().default(''),
      bio: z.string().max(500).default('')
    }).default({}),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']).default('system'),
      language: z.string().default('en'),
      timezone: z.string().default('UTC'),
      notifications: z.object({
        email: z.boolean().default(true),
        sms: z.boolean().default(true),
        push: z.boolean().default(true)
      }).default({})
    }).default({}),
    company: z.string().min(1, 'Company ID is required')
  }),

  update: z.object({
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    role: z.enum(['admin', 'manager', 'supervisor', 'agent']).optional(),
    department: z.string().min(1).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    profile: z.object({
      avatar: z.string().optional(),
      phone: z.string().optional(),
      extension: z.string().optional(),
      location: z.string().optional(),
      bio: z.string().max(500).optional()
    }).optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
      notifications: z.object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
        push: z.boolean().optional()
      }).optional()
    }).optional()
  })
};

// Queue validation schemas
export const queueSchemas = {
  create: z.object({
    name: z.string().min(1, 'Queue name is required').max(100, 'Queue name too long'),
    description: z.string().max(500).default(''),
    type: z.enum(['inbound', 'outbound', 'blended']).default('inbound'),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
    settings: z.object({
      maxWaitTime: z.number().min(0).default(300),
      serviceLevel: z.number().min(0).max(100).default(80),
      overflow: z.object({
        enabled: z.boolean().default(false),
        targetQueue: z.string().optional(),
        waitTime: z.number().min(0).default(180)
      }).default({}),
      callback: z.object({
        enabled: z.boolean().default(false),
        maxAttempts: z.number().min(1).max(10).default(3),
        interval: z.number().min(1).default(30)
      }).default({}),
      recording: z.object({
        enabled: z.boolean().default(true),
        quality: z.enum(['low', 'medium', 'high']).default('medium'),
        retention: z.number().min(1).default(90)
      }).default({})
    }).default({}),
    agents: z.array(z.string()).default([]),
    company: z.string().min(1, 'Company ID is required')
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    type: z.enum(['inbound', 'outbound', 'blended']).optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional(),
    settings: z.object({
      maxWaitTime: z.number().min(0).optional(),
      serviceLevel: z.number().min(0).max(100).optional(),
      overflow: z.object({
        enabled: z.boolean().optional(),
        targetQueue: z.string().optional(),
        waitTime: z.number().min(0).optional()
      }).optional(),
      callback: z.object({
        enabled: z.boolean().optional(),
        maxAttempts: z.number().min(1).max(10).optional(),
        interval: z.number().min(1).optional()
      }).optional(),
      recording: z.object({
        enabled: z.boolean().optional(),
        quality: z.enum(['low', 'medium', 'high']).optional(),
        retention: z.number().min(1).optional()
      }).optional()
    }).optional(),
    agents: z.array(z.string()).optional()
  })
};