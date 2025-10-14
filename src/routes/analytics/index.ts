import { NextRequest } from 'next/server';
import { AnalyticsController } from '@/controllers/AnalyticsController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/analytics - Get all analytics
export const GET = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  const queryValidation = validateQueryMiddleware(
    commonSchemas.pagination
      .merge(z.object({
        period: z.string().optional(),
        companyId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional()
      }))
  )(req);
  
  if (queryValidation instanceof NextResponse) {
    return queryValidation;
  }

  return await AnalyticsController.getAnalytics(req);
}));