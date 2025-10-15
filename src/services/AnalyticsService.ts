import { Analytics } from '@/models';
import { DBService } from '@/lib/mongodb';

export interface AnalyticsFilters {
  page?: number;
  limit?: number;
  period?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateAnalyticsData {
  company: string;
  date: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  callCenter?: {
    totalCalls?: number;
    answeredCalls?: number;
    abandonedCalls?: number;
    missedCalls?: number;
    averageWaitTime?: number;
    averageHandleTime?: number;
    averageTalkTime?: number;
    serviceLevel?: number;
    occupancy?: number;
    efficiency?: number;
  };
  queues?: Array<{
    queue: string;
    queueName: string;
    totalCalls?: number;
    answeredCalls?: number;
    abandonedCalls?: number;
    averageWaitTime?: number;
    averageHandleTime?: number;
    serviceLevel?: number;
    longestWaitTime?: number;
  }>;
  agents?: Array<{
    agent: string;
    agentName: string;
    totalCalls?: number;
    answeredCalls?: number;
    averageHandleTime?: number;
    averageTalkTime?: number;
    averageWrapTime?: number;
    satisfaction?: number;
    qualityScore?: number;
    adherence?: number;
  }>;
  performance?: {
    callsPerHour?: number;
    averageSpeedOfAnswer?: number;
    abandonRate?: number;
    firstCallResolution?: number;
    customerSatisfaction?: number;
    netPromoterScore?: number;
    costPerCall?: number;
    revenuePerCall?: number;
  };
  trends?: {
    callVolume?: number[];
    waitTimes?: number[];
    handleTimes?: number[];
    satisfaction?: number[];
    serviceLevels?: number[];
  };
  insights?: {
    peakHours?: number[];
    busyQueues?: string[];
    topAgents?: string[];
    issues?: string[];
    recommendations?: string[];
  };
}

export class AnalyticsService {
  /**
   * Get analytics by ID
   */
  static async getAnalyticsById(id: string) {
    return await DBService.findById(Analytics, id);
  }

  /**
   * Get analytics with filtering and pagination
   */
  static async getAnalytics(filters: AnalyticsFilters = {}) {
    const { page = 1, limit = 10, period = 'daily', companyId = '', startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (period) {
      query.period = period;
    }

    if (companyId) {
      query.company = companyId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const [analytics, total] = await Promise.all([
      DBService.find(Analytics, query, { 
        skip, 
        limit,
        sort: { date: -1 }
      }),
      DBService.count(Analytics, query)
    ]);

    return { analytics, total };
  }

  /**
   * Create new analytics
   */
  static async createAnalytics(data: CreateAnalyticsData) {
    // Prepare analytics data with defaults
    const analyticsData = {
      ...data,
      callCenter: {
        totalCalls: data.callCenter?.totalCalls || 0,
        answeredCalls: data.callCenter?.answeredCalls || 0,
        abandonedCalls: data.callCenter?.abandonedCalls || 0,
        missedCalls: data.callCenter?.missedCalls || 0,
        averageWaitTime: data.callCenter?.averageWaitTime || 0,
        averageHandleTime: data.callCenter?.averageHandleTime || 0,
        averageTalkTime: data.callCenter?.averageTalkTime || 0,
        serviceLevel: data.callCenter?.serviceLevel || 0,
        occupancy: data.callCenter?.occupancy || 0,
        efficiency: data.callCenter?.efficiency || 0
      },
      performance: {
        callsPerHour: data.performance?.callsPerHour || 0,
        averageSpeedOfAnswer: data.performance?.averageSpeedOfAnswer || 0,
        abandonRate: data.performance?.abandonRate || 0,
        firstCallResolution: data.performance?.firstCallResolution || 0,
        customerSatisfaction: data.performance?.customerSatisfaction || 0,
        netPromoterScore: data.performance?.netPromoterScore,
        costPerCall: data.performance?.costPerCall,
        revenuePerCall: data.performance?.revenuePerCall
      },
      trends: {
        callVolume: data.trends?.callVolume || [],
        waitTimes: data.trends?.waitTimes || [],
        handleTimes: data.trends?.handleTimes || [],
        satisfaction: data.trends?.satisfaction || [],
        serviceLevels: data.trends?.serviceLevels || []
      },
      insights: {
        peakHours: data.insights?.peakHours || [],
        busyQueues: data.insights?.busyQueues || [],
        topAgents: data.insights?.topAgents || [],
        issues: data.insights?.issues || [],
        recommendations: data.insights?.recommendations || []
      }
    };

    return await DBService.create(Analytics, analyticsData);
  }

  /**
   * Get analytics by company
   */
  static async getAnalyticsByCompany(companyId: string, filters: Omit<AnalyticsFilters, 'companyId'> = {}) {
    return await this.getAnalytics({ ...filters, companyId });
  }

  /**
   * Get latest analytics for company
   */
  static async getLatestAnalytics(companyId: string, period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily') {
    return await DBService.findOne(Analytics, { 
      company: companyId, 
      period 
    }, {
      sort: { date: -1 }
    });
  }

  /**
   * Create daily analytics for company
   */
  static async createDailyAnalytics(companyId: string, date: Date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // This would typically involve aggregating call data
    // For now, create with default values
    const analyticsData: CreateAnalyticsData = {
      company: companyId,
      date,
      period: 'daily',
      callCenter: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        missedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        averageTalkTime: 0,
        serviceLevel: 0,
        occupancy: 0,
        efficiency: 0
      },
      queues: [],
      agents: [],
      performance: {
        callsPerHour: 0,
        averageSpeedOfAnswer: 0,
        abandonRate: 0,
        firstCallResolution: 0,
        customerSatisfaction: 0
      },
      trends: {
        callVolume: [],
        waitTimes: [],
        handleTimes: [],
        satisfaction: [],
        serviceLevels: []
      },
      insights: {
        peakHours: [],
        busyQueues: [],
        topAgents: [],
        issues: [],
        recommendations: []
      }
    };

    return await this.createAnalytics(analyticsData);
  }

  /**
   * Get call center performance analytics
   */
  static async getCallCenterPerformance(
    companyId: string, 
    startDate?: Date, 
    endDate?: Date, 
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
  ) {
    const query: any = { company: companyId, period };
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const analytics = await DBService.find(Analytics, query, {
      sort: { date: -1 }
    });

    // Aggregate performance metrics
    const totalCalls = analytics.reduce((sum, a) => sum + (a.callCenter?.totalCalls || 0), 0);
    const answeredCalls = analytics.reduce((sum, a) => sum + (a.callCenter?.answeredCalls || 0), 0);
    const abandonedCalls = analytics.reduce((sum, a) => sum + (a.callCenter?.abandonedCalls || 0), 0);
    
    const avgWaitTime = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + (a.callCenter?.averageWaitTime || 0), 0) / analytics.length 
      : 0;
    
    const avgHandleTime = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + (a.callCenter?.averageHandleTime || 0), 0) / analytics.length 
      : 0;

    return {
      totalCalls,
      answeredCalls,
      abandonedCalls,
      answerRate: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
      abandonRate: totalCalls > 0 ? (abandonedCalls / totalCalls) * 100 : 0,
      averageWaitTime: avgWaitTime,
      averageHandleTime: avgHandleTime,
      serviceLevel: analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.callCenter?.serviceLevel || 0), 0) / analytics.length 
        : 0,
      analytics
    };
  }

  /**
   * Get queue performance analytics
   */
  static async getQueuePerformance(
    companyId: string, 
    startDate?: Date, 
    endDate?: Date, 
    queueId?: string
  ) {
    const query: any = { company: companyId };
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const analytics = await DBService.find(Analytics, query, {
      sort: { date: -1 }
    });

    // Aggregate queue performance
    const queuePerformance: any[] = [];
    
    analytics.forEach(analytic => {
      analytic.queues?.forEach((queue: any) => {
        if (!queueId || queue.queue.toString() === queueId) {
          queuePerformance.push({
            ...queue,
            date: analytic.date,
            period: analytic.period
          });
        }
      });
    });

    return {
      queuePerformance,
      totalQueues: queuePerformance.length
    };
  }

  /**
   * Get agent performance analytics
   */
  static async getAgentPerformance(
    companyId: string, 
    startDate?: Date, 
    endDate?: Date, 
    agentId?: string
  ) {
    const query: any = { company: companyId };
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const analytics = await DBService.find(Analytics, query, {
      sort: { date: -1 }
    });

    // Aggregate agent performance
    const agentPerformance: any[] = [];
    
    analytics.forEach(analytic => {
      analytic.agents?.forEach((agent: any) => {
        if (!agentId || agent.agent.toString() === agentId) {
          agentPerformance.push({
            ...agent,
            date: analytic.date,
            period: analytic.period
          });
        }
      });
    });

    return {
      agentPerformance,
      totalAgents: agentPerformance.length
    };
  }

  /**
   * Get analytics trends
   */
  static async getAnalyticsTrends(
    companyId: string, 
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
    metric: 'callVolume' | 'waitTimes' | 'handleTimes' | 'satisfaction' | 'serviceLevels' = 'callVolume',
    days: number = 30
  ) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await DBService.find(Analytics, {
      company: companyId,
      period,
      date: { $gte: startDate, $lte: endDate }
    }, {
      sort: { date: 1 }
    });

    const trends = analytics.map(analytic => ({
      date: analytic.date,
      value: analytic.trends[metric] || 0
    }));

    return {
      trends,
      metric,
      period,
      dateRange: { startDate, endDate }
    };
  }

  /**
   * Get analytics summary for dashboard
   */
  static async getAnalyticsSummary(companyId: string) {
    const [latestAnalytics, weeklyAnalytics] = await Promise.all([
      this.getLatestAnalytics(companyId, 'daily'),
      this.getAnalyticsByCompany(companyId, { 
        period: 'daily',
        limit: 7 
      })
    ]);

    if (!latestAnalytics) {
      return {
        callCenter: null,
        trends: [],
        summary: null
      };
    }

    return {
      callCenter: latestAnalytics.callCenter,
      trends: latestAnalytics.trends,
      summary: {
        totalAnalytics: weeklyAnalytics.total,
        latestUpdate: latestAnalytics.date,
        period: latestAnalytics.period
      }
    };
  }
}