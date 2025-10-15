import { NextRequest } from 'next/server';
import { DashboardController } from '@/controllers/DashboardController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/dashboards/[id] - Get dashboard by ID
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await DashboardController.getDashboard(req, { params });
}));

// PUT /api/dashboards/[id] - Update dashboard
export const PUT = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await DashboardController.updateDashboard(req, { params });
}));

// DELETE /api/dashboards/[id] - Delete dashboard
export const DELETE = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await DashboardController.deleteDashboard(req, { params });
}));