import { NextRequest } from 'next/server';
import { QueueController } from '@/controllers/QueueController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateMiddleware, validateQueryMiddleware, queueSchemas, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/queues - Get all queues
export const GET = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  const queryValidation = validateQueryMiddleware(
    commonSchemas.pagination
      .merge(commonSchemas.search)
      .merge(z.object({
        type: z.string().optional(),
        status: z.string().optional(),
        companyId: z.string().optional()
      }))
  )(req);
  
  if (queryValidation instanceof NextResponse) {
    return queryValidation;
  }

  return await QueueController.getQueues(req);
}));

// POST /api/queues - Create new queue
export const POST = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const bodyValidation = await validateMiddleware(queueSchemas.create)(req);
  
  if (bodyValidation instanceof NextResponse) {
    return bodyValidation;
  }

  return await QueueController.createQueue(req);
}));