import { NextRequest } from 'next/server';
import { AnalyticsController } from '@/controllers/AnalyticsController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// POST /api/analytics/daily/[companyId] - Create daily analytics for company
export const POST = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { companyId: string } }) => {
  // Validate company ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  return await AnalyticsController.createDailyAnalytics(req, { params });
}));