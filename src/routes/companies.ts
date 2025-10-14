import { NextRequest } from 'next/server';
import { CompanyController } from '@/controllers/CompanyController';
import { withMongoDB } from '@/lib/mongodb-middleware';
import { asyncHandler } from '@/middlewares/error';

// GET /api/companies - Get all companies
export const GET = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  const queryValidation = validateQueryMiddleware(
    commonSchemas.pagination.merge(commonSchemas.search)
  )(req);
  
  if (queryValidation instanceof NextResponse) {
    return queryValidation;
  }

  return await CompanyController.getCompanies(req);
}));

// POST /api/companies - Create new company
export const POST = withMongoDB(asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const bodyValidation = await validateMiddleware(companySchemas.create)(req);
  
  if (bodyValidation instanceof NextResponse) {
    return bodyValidation;
  }

  return await CompanyController.createCompany(req);
}));