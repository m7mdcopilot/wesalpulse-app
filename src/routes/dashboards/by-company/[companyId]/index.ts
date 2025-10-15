import { NextRequest } from 'next/server';
import { DashboardController } from '@/controllers/DashboardController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/dashboards/by-company/[companyId] - Get dashboards by company
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { companyId: string } }) => {
  // Validate company ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await DashboardController.getDashboardsByCompany(req, { params });
}));