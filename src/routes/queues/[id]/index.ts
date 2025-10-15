import { NextRequest } from 'next/server';
import { QueueController } from '@/controllers/QueueController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/queues/[id] - Get queue by ID
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await QueueController.getQueue(req, { params });
}));

// PUT /api/queues/[id] - Update queue
export const PUT = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  // Validate request body
  const bodyValidation = await validateMiddleware(queueSchemas.update)(req);
  
  if (bodyValidation instanceof NextResponse) {
    return bodyValidation;
  }

  return await QueueController.updateQueue(req, { params });
}));

// DELETE /api/queues/[id] - Delete queue
export const DELETE = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await QueueController.deleteQueue(req, { params });
}));