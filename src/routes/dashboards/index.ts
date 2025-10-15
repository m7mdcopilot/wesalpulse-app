import { NextRequest } from 'next/server';
import { DashboardController } from '@/controllers/DashboardController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { validateQueryMiddleware, commonSchemas } from '@/middlewares/validation';
import { asyncHandler } from '@/middlewares/error';

// GET /api/dashboards - Get all dashboards
export const GET = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  const queryValidation = validateQueryMiddleware(
    commonSchemas.pagination
      .merge(commonSchemas.search)
      .merge(z.object({
        type: z.string().optional(),
        companyId: z.string().optional(),
        isPublic: z.string().optional()
      }))
  )(req);
  
  if (queryValidation instanceof NextResponse) {
    return queryValidation;
  }

  return await DashboardController.getDashboards(req);
}));