import { NextRequest } from 'next/server';
import { CompanyController } from '@/controllers/CompanyController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { asyncHandler } from '@/middlewares/error';

// GET /api/companies/[id] - Get company by ID
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

  return await CompanyController.getCompany(req, { params });
}));

// PUT /api/companies/[id] - Update company
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

  // Validate request body
  const bodyValidation = await validateMiddleware(companySchemas.update)(req);
  
  if (bodyValidation instanceof NextResponse) {
    return bodyValidation;
  }

  return await CompanyController.updateCompany(req, { params });
}));

// DELETE /api/companies/[id] - Delete company
export const DELETE = withMongoDB(asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
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

  return await CompanyController.deleteCompany(req, { params });
}));