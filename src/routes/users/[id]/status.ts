import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/UserController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// PUT /api/users/[id]/status - Update user status
export const PUT = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await UserController.updateUserStatus(req, { params });
}));