import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/AnalyticsService';

export class AnalyticsController {
  /**
   * Get analytics by ID
   */
  static async getAnalytics(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const analytics = await AnalyticsService.getAnalyticsById(params.id);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Analytics not found', message: 'Analytics does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }
  }

  /**
   * Get all analytics (with pagination and filtering)
   */
  static async getAnalytics(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const period = searchParams.get('period') || 'daily';
      const companyId = searchParams.get('companyId') || '';
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      const result = await AnalyticsService.getAnalytics({ 
        page, 
        limit, 
        period, 
        companyId,
        startDate,
        endDate
      });

      return NextResponse.json({
        success: true,
        data: result.analytics,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }
  }

  /**
   * Create new analytics
   */
  static async createAnalytics(req: NextRequest) {
    try {
      const body = await req.json();

      const analytics = await AnalyticsService.createAnalytics(body);

      return NextResponse.json({
        success: true,
        data: analytics,
        message: 'Analytics created successfully'
      }, { status: 201 });
    } catch (error) {
      console.error('Create analytics error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create analytics' },
        { status: 500 }
      );
    }
  }

  /**
   * Get analytics by company
   */
  static async getAnalyticsByCompany(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '30');
      const period = searchParams.get('period') || 'daily';
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      const result = await AnalyticsService.getAnalyticsByCompany(params.companyId, {
        page, limit, period, startDate, endDate
      });

      return NextResponse.json({
        success: true,
        data: result.analytics,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get analytics by company error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch analytics by company' },
        { status: 500 }
      );
    }
  }

  /**
   * Get latest analytics for company
   */
  static async getLatestAnalytics(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const period = searchParams.get('period') || 'daily';

      const analytics = await AnalyticsService.getLatestAnalytics(params.companyId, period);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Analytics not found', message: 'No analytics found for this company' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get latest analytics error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch latest analytics' },
        { status: 500 }
      );
    }
  }

  /**
   * Create daily analytics for company
   */
  static async createDailyAnalytics(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const body = await req.json();
      const { date } = body;

      const analytics = await AnalyticsService.createDailyAnalytics(params.companyId, new Date(date));

      return NextResponse.json({
        success: true,
        data: analytics,
        message: 'Daily analytics created successfully'
      }, { status: 201 });
    } catch (error) {
      console.error('Create daily analytics error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create daily analytics' },
        { status: 500 }
      );
    }
  }

  /**
   * Get call center performance analytics
   */
  static async getCallCenterPerformance(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const period = searchParams.get('period') || 'daily';

      const performance = await AnalyticsService.getCallCenterPerformance(
        params.companyId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        period
      );

      return NextResponse.json({
        success: true,
        data: performance
      });
    } catch (error) {
      console.error('Get call center performance error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch call center performance' },
        { status: 500 }
      );
    }
  }

  /**
   * Get queue performance analytics
   */
  static async getQueuePerformance(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const queueId = searchParams.get('queueId');

      const performance = await AnalyticsService.getQueuePerformance(
        params.companyId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        queueId
      );

      return NextResponse.json({
        success: true,
        data: performance
      });
    } catch (error) {
      console.error('Get queue performance error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch queue performance' },
        { status: 500 }
      );
    }
  }

  /**
   * Get agent performance analytics
   */
  static async getAgentPerformance(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const agentId = searchParams.get('agentId');

      const performance = await AnalyticsService.getAgentPerformance(
        params.companyId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        agentId
      );

      return NextResponse.json({
        success: true,
        data: performance
      });
    } catch (error) {
      console.error('Get agent performance error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch agent performance' },
        { status: 500 }
      );
    }
  }

  /**
   * Get analytics trends
   */
  static async getAnalyticsTrends(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const period = searchParams.get('period') || 'daily';
      const metric = searchParams.get('metric') || 'callVolume';
      const days = parseInt(searchParams.get('days') || '30');

      const trends = await AnalyticsService.getAnalyticsTrends(params.companyId, period, metric, days);

      return NextResponse.json({
        success: true,
        data: trends
      });
    } catch (error) {
      console.error('Get analytics trends error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch analytics trends' },
        { status: 500 }
      );
    }
  }
}