import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/UserController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateMiddleware, validateQueryMiddleware, userSchemas, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/users - Get all users
export const GET = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  const queryValidation = validateQueryMiddleware(
    commonSchemas.pagination
      .merge(commonSchemas.search)
      .merge(z.object({
        role: z.string().optional(),
        status: z.string().optional(),
        companyId: z.string().optional()
      }))
  )(req);
  
  if (queryValidation instanceof NextResponse) {
    return queryValidation;
  }

  return await UserController.getUsers(req);
}));

// POST /api/users - Create new user
export const POST = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const bodyValidation = await validateMiddleware(userSchemas.create)(req);
  
  if (bodyValidation instanceof NextResponse) {
    return bodyValidation;
  }

  return await UserController.createUser(req);
}));