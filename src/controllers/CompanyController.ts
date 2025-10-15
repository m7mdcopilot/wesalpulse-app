import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/services/CompanyService';

export class CompanyController {
  /**
   * Get company by ID
   */
  static async getCompany(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const company = await CompanyService.getCompanyById(params.id);
      
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found', message: 'Company does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: company
      });
    } catch (error) {
      console.error('Get company error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch company' },
        { status: 500 }
      );
    }
  }

  /**
   * Get all companies (with pagination)
   */
  static async getCompanies(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';

      const result = await CompanyService.getCompanies({ page, limit, search });

      return NextResponse.json({
        success: true,
        data: result.companies,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get companies error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch companies' },
        { status: 500 }
      );
    }
  }

  /**
   * Create new company
   */
  static async createCompany(req: NextRequest) {
    try {
      const body = await req.json();

      const company = await CompanyService.createCompany(body);

      return NextResponse.json({
        success: true,
        data: company,
        message: 'Company created successfully'
      }, { status: 201 });
    } catch (error) {
      console.error('Create company error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create company' },
        { status: 500 }
      );
    }
  }

  /**
   * Update company
   */
  static async updateCompany(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();

      const company = await CompanyService.updateCompany(params.id, body);

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found', message: 'Company does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: company,
        message: 'Company updated successfully'
      });
    } catch (error) {
      console.error('Update company error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update company' },
        { status: 500 }
      );
    }
  }

  /**
   * Delete company
   */
  static async deleteCompany(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const success = await CompanyService.deleteCompany(params.id);

      if (!success) {
        return NextResponse.json(
          { error: 'Company not found', message: 'Company does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      console.error('Delete company error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to delete company' },
        { status: 500 }
      );
    }
  }

  /**
   * Get company settings
   */
  static async getCompanySettings(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const settings = await CompanyService.getCompanySettings(params.id);
      
      if (!settings) {
        return NextResponse.json(
          { error: 'Company not found', message: 'Company does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Get company settings error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch company settings' },
        { status: 500 }
      );
    }
  }

  /**
   * Update company settings
   */
  static async updateCompanySettings(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();

      const settings = await CompanyService.updateCompanySettings(params.id, body);

      if (!settings) {
        return NextResponse.json(
          { error: 'Company not found', message: 'Company does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: settings,
        message: 'Company settings updated successfully'
      });
    } catch (error) {
      console.error('Update company settings error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update company settings' },
        { status: 500 }
      );
    }
  }
}