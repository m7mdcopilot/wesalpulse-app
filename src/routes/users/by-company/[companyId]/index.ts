import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/UserController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/users/by-company/[companyId] - Get users by company
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { companyId: string } }) => {
  // Validate company ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await UserController.getUsersByCompany(req, { params });
}));