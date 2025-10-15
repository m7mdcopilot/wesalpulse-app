import { NextRequest } from 'next/server';
import { CompanyController } from '@/controllers/CompanyController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { asyncHandler } from '@/middlewares/error';

// GET /api/companies/[id]/settings - Get company settings
export const GET = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  // Check company access
  const accessCheck = await companyAccessMiddleware(req, params.id);
  if (accessCheck instanceof NextResponse) {
    return accessCheck;
  }

  return await CompanyController.getCompanySettings(req, { params });
}));

// PUT /api/companies/[id]/settings - Update company settings
export const PUT = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate ID parameter
  const idValidation = validateQueryMiddleware(commonSchemas.id)(req);
  
  if (idValidation instanceof NextResponse) {
    return idValidation;
  }

  // Check company access
  const accessCheck = await companyAccessMiddleware(req, params.id);
  if (accessCheck instanceof NextResponse) {
    return accessCheck;
  }

  return await CompanyController.updateCompanySettings(req, { params });
}));