import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/UserController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/users/[id] - Get user by ID
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await UserController.getUser(req, { params });
}));

// PUT /api/users/[id] - Update user
export const PUT = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  // Validate request body
  const bodyValidation = await validateMiddleware(userSchemas.update)(req);
  
  if (bodyValidation instanceof NextResponse) {
    return bodyValidation;
  }

  return await UserController.updateUser(req, { params });
}));

// DELETE /api/users/[id] - Delete user
export const DELETE = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await UserController.deleteUser(req, { params });
}));