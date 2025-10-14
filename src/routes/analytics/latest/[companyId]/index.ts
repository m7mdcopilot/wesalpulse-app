import { NextRequest } from 'next/server';
import { AnalyticsController } from '@/controllers/AnalyticsController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/analytics/latest/[companyId] - Get latest analytics for company
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { companyId: string } }) => {
  // Validate company ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await AnalyticsController.getLatestAnalytics(req, { params });
}));