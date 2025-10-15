import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/DashboardService';

export class DashboardController {
  /**
   * Get dashboard by ID
   */
  static async getDashboard(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const dashboard = await DashboardService.getDashboardById(params.id);
      
      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found', message: 'Dashboard does not exist' },
          { status: 404 }
        );
      }

      // Update access statistics
      await DashboardService.updateDashboardAccess(params.id);

      return NextResponse.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Get all dashboards (with pagination and filtering)
   */
  static async getDashboards(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      const type = searchParams.get('type') || '';
      const companyId = searchParams.get('companyId') || '';
      const isPublic = searchParams.get('isPublic') === 'true';

      const result = await DashboardService.getDashboards({ 
        page, 
        limit, 
        search, 
        type, 
        companyId,
        isPublic
      });

      return NextResponse.json({
        success: true,
        data: result.dashboards,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get dashboards error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch dashboards' },
        { status: 500 }
      );
    }
  }

  /**
   * Create new dashboard
   */
  static async createDashboard(req: NextRequest) {
    try {
      const body = await req.json();

      const dashboard = await DashboardService.createDashboard(body);

      return NextResponse.json({
        success: true,
        data: dashboard,
        message: 'Dashboard created successfully'
      }, { status: 201 });
    } catch (error) {
      console.error('Create dashboard error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Update dashboard
   */
  static async updateDashboard(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();

      const dashboard = await DashboardService.updateDashboard(params.id, body);

      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found', message: 'Dashboard does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: dashboard,
        message: 'Dashboard updated successfully'
      });
    } catch (error) {
      console.error('Update dashboard error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Delete dashboard
   */
  static async deleteDashboard(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const success = await DashboardService.deleteDashboard(params.id);

      if (!success) {
        return NextResponse.json(
          { error: 'Dashboard not found', message: 'Dashboard does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Dashboard deleted successfully'
      });
    } catch (error) {
      console.error('Delete dashboard error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to delete dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Get dashboards by company
   */
  static async getDashboardsByCompany(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const type = searchParams.get('type') || '';
      const isPublic = searchParams.get('isPublic') === 'true';

      const result = await DashboardService.getDashboardsByCompany(params.companyId, {
        page, limit, type, isPublic
      });

      return NextResponse.json({
        success: true,
        data: result.dashboards,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get dashboards by company error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch dashboards by company' },
        { status: 500 }
      );
    }
  }

  /**
   * Get default dashboard for company
   */
  static async getDefaultDashboard(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const dashboard = await DashboardService.getDefaultDashboard(params.companyId);
      
      if (!dashboard) {
        return NextResponse.json(
          { error: 'Default dashboard not found', message: 'No default dashboard exists for this company' },
          { status: 404 }
        );
      }

      // Update access statistics
      await DashboardService.updateDashboardAccess(dashboard._id.toString());

      return NextResponse.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Get default dashboard error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch default dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Add widget to dashboard
   */
  static async addWidgetToDashboard(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { widget } = body;

      const dashboard = await DashboardService.addWidgetToDashboard(params.id, widget);

      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found', message: 'Dashboard does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: dashboard,
        message: 'Widget added to dashboard successfully'
      });
    } catch (error) {
      console.error('Add widget to dashboard error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to add widget to dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Remove widget from dashboard
   */
  static async removeWidgetFromDashboard(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { widgetId } = body;

      const dashboard = await DashboardService.removeWidgetFromDashboard(params.id, widgetId);

      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found', message: 'Dashboard does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: dashboard,
        message: 'Widget removed from dashboard successfully'
      });
    } catch (error) {
      console.error('Remove widget from dashboard error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to remove widget from dashboard' },
        { status: 500 }
      );
    }
  }

  /**
   * Update widget position in dashboard
   */
  static async updateWidgetPosition(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { widgetId, position } = body;

      const dashboard = await DashboardService.updateWidgetPosition(params.id, widgetId, position);

      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found', message: 'Dashboard does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: dashboard,
        message: 'Widget position updated successfully'
      });
    } catch (error) {
      console.error('Update widget position error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update widget position' },
        { status: 500 }
      );
    }
  }
}