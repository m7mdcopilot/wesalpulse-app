import { DashboardsData, AnalysesData, DataviewData, Company } from '@/models';
import { DBService } from '@/lib/mongodb';

export interface DataCollectionFilters {
  companyId: string;
  startDate?: Date;
  endDate?: Date;
  period?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  viewType?: string;
  analysisType?: string;
}

export class DataCollectionService {
  /**
   * Get latest dashboard data for a company
   */
  static async getLatestDashboardData(companyId: string, period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily') {
    return await DBService.findOne(DashboardsData, {
      companyId,
      period
    }, {
      sort: { refreshDate: -1 }
    });
  }

  /**
   * Get dashboard data for a date range
   */
  static async getDashboardDataForRange(filters: DataCollectionFilters) {
    const { companyId, startDate, endDate, period = 'daily' } = filters;
    
    const query: any = {
      companyId,
      period
    };

    if (startDate && endDate) {
      query.refreshDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    return await DBService.find(DashboardsData, query, {
      sort: { refreshDate: -1 }
    });
  }

  /**
   * Get latest analysis data for a company
   */
  static async getLatestAnalysisData(companyId: string, analysisType: 'performance' | 'trends' | 'quality' | 'efficiency' | 'customer_experience' = 'performance') {
    return await DBService.findOne(AnalysesData, {
      companyId,
      analysisType
    }, {
      sort: { refreshDate: -1 }
    });
  }

  /**
   * Get analysis data for a date range
   */
  static async getAnalysisDataForRange(filters: DataCollectionFilters) {
    const { companyId, startDate, endDate, period = 'daily', analysisType = 'performance' } = filters;
    
    const query: any = {
      companyId,
      period,
      analysisType
    };

    if (startDate && endDate) {
      query.refreshDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    return await DBService.find(AnalysesData, query, {
      sort: { refreshDate: -1 }
    });
  }

  /**
   * Get latest dataview data for a company
   */
  static async getLatestDataviewData(companyId: string, viewType: 'table' | 'chart' | 'metric' | 'timeline' | 'comparison' = 'chart') {
    return await DBService.findOne(DataviewData, {
      companyId,
      viewType
    }, {
      sort: { refreshDate: -1 }
    });
  }

  /**
   * Get dataview data for a date range
   */
  static async getDataviewDataForRange(filters: DataCollectionFilters) {
    const { companyId, startDate, endDate, viewType = 'chart' } = filters;
    
    const query: any = {
      companyId,
      viewType
    };

    if (startDate && endDate) {
      query.refreshDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    return await DBService.find(DataviewData, query, {
      sort: { refreshDate: -1 }
    });
  }

  /**
   * Get all data types for a company (dashboard, analysis, dataview)
   */
  static async getCompanyDataOverview(companyId: string) {
    const [dashboardData, analysisData, dataviewData] = await Promise.all([
      this.getLatestDashboardData(companyId),
      this.getLatestAnalysisData(companyId),
      this.getLatestDataviewData(companyId)
    ]);

    return {
      dashboard: dashboardData,
      analysis: analysisData,
      dataview: dataviewData,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get historical data for charts and trends
   */
  static async getHistoricalData(companyId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [dashboardHistory, analysisHistory] = await Promise.all([
      this.getDashboardDataForRange({
        companyId,
        startDate,
        endDate,
        period: 'daily'
      }),
      this.getAnalysisDataForRange({
        companyId,
        startDate,
        endDate,
        period: 'daily'
      })
    ]);

    return {
      dashboard: dashboardHistory,
      analysis: analysisHistory,
      period: 'daily',
      range: {
        start: startDate,
        end: endDate
      }
    };
  }

  /**
   * Get data refresh status
   */
  static async getDataRefreshStatus(companyId: string) {
    const [dashboardData, analysisData, dataviewData] = await Promise.all([
      this.getLatestDashboardData(companyId),
      this.getLatestAnalysisData(companyId),
      this.getLatestDataviewData(companyId)
    ]);

    const now = new Date();
    const getStatus = (data: any) => {
      if (!data) return { status: 'missing', lastRefresh: null, age: null };
      
      const lastRefresh = new Date(data.refreshDate);
      const ageInHours = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
      
      return {
        status: ageInHours > 24 ? 'stale' : 'fresh',
        lastRefresh: data.refreshDate,
        age: Math.floor(ageInHours)
      };
    };

    return {
      dashboard: getStatus(dashboardData),
      analysis: getStatus(analysisData),
      dataview: getStatus(dataviewData),
      overall: {
        status: 'unknown',
        message: 'Data refresh status check completed'
      }
    };
  }

  /**
   * Format seconds to MM:SS format
   */
  static formatSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get dashboard analytics data from pre-calculated collections
   */
  static async getDashboardAnalytics(companyId: string) {
    try {
      // Get the latest dashboard data
      const dashboardData = await this.getLatestDashboardData(companyId);
      
      if (!dashboardData) {
        throw new Error('No dashboard data found for company');
      }

      // Get the latest analysis data
      const analysisData = await this.getLatestAnalysisData(companyId, 'performance');

      // Format the data for the dashboard
      const callCenterStatusToday = {
        currentCallStatus: {
          activeCalls: dashboardData.callCenter.answeredCalls - dashboardData.callCenter.missedCalls,
          totalAgents: dashboardData.agents.length,
          availableAgents: Math.floor(dashboardData.agents.length * 0.8), // Assuming 80% availability
          onBreakAgents: Math.floor(dashboardData.agents.length * 0.15),
          inTrainingAgents: Math.floor(dashboardData.agents.length * 0.05),
          utilizationRate: `${Math.floor(dashboardData.callCenter.occupancy)}%`,
          lastUpdated: dashboardData.refreshDate.toISOString()
        },
        callOutcomes: {
          answered: dashboardData.callCenter.answeredCalls,
          abandoned: dashboardData.callCenter.abandonedCalls,
          transferred: Math.floor(dashboardData.callCenter.answeredCalls * 0.1), // Estimate
          voicemail: dashboardData.callCenter.missedCalls,
          total: dashboardData.callCenter.totalCalls,
          answerRate: dashboardData.callCenter.totalCalls > 0 ? 
            `${Math.floor((dashboardData.callCenter.answeredCalls / dashboardData.callCenter.totalCalls) * 100)}%` : '0%',
          lastUpdated: dashboardData.refreshDate.toISOString()
        },
        callHandlingMetrics: {
          averageHandleTime: this.formatSeconds(dashboardData.callCenter.averageHandleTime),
          averageTalkTime: this.formatSeconds(dashboardData.callCenter.averageTalkTime),
          averageWrapUpTime: this.formatSeconds(dashboardData.callCenter.averageHandleTime - dashboardData.callCenter.averageTalkTime),
          serviceLevel: `${Math.floor(dashboardData.callCenter.serviceLevel)}%`,
          firstCallResolution: `${Math.floor(dashboardData.callCenter.firstCallResolution)}%`,
          lastUpdated: dashboardData.refreshDate.toISOString()
        }
      };

      const callCenterPerformance = {
        overview: {
          totalCalls: dashboardData.callCenter.totalCalls,
          answeredCalls: dashboardData.callCenter.answeredCalls,
          abandonedCalls: dashboardData.callCenter.abandonedCalls,
          serviceLevel: `${Math.floor(dashboardData.callCenter.serviceLevel)}%`,
          averageWaitTime: this.formatSeconds(dashboardData.callCenter.averageWaitTime),
          lastUpdated: dashboardData.refreshDate.toISOString()
        },
        metrics: [
          {
            name: "Answer Rate",
            value: dashboardData.callCenter.totalCalls > 0 ? 
              `${Math.floor((dashboardData.callCenter.answeredCalls / dashboardData.callCenter.totalCalls) * 100)}%` : '0%',
            trend: "stable",
            change: "0%"
          },
          {
            name: "Service Level", 
            value: `${Math.floor(dashboardData.callCenter.serviceLevel)}%`,
            trend: "stable",
            change: "0%"
          },
          {
            name: "Abandon Rate",
            value: dashboardData.callCenter.totalCalls > 0 ? 
              `${Math.floor((dashboardData.callCenter.abandonedCalls / dashboardData.callCenter.totalCalls) * 100)}%` : '0%',
            trend: "stable", 
            change: "0%"
          },
          {
            name: "Average Wait Time",
            value: this.formatSeconds(dashboardData.callCenter.averageWaitTime),
            trend: "stable",
            change: "0:00"
          }
        ],
        trends: [
          {
            period: "Last Hour",
            calls: Math.floor(dashboardData.callCenter.totalCalls * 0.1),
            answered: Math.floor(dashboardData.callCenter.answeredCalls * 0.1),
            abandoned: Math.floor(dashboardData.callCenter.abandonedCalls * 0.1),
            serviceLevel: Math.floor(dashboardData.callCenter.serviceLevel)
          },
          {
            period: "Last 6 Hours",
            calls: Math.floor(dashboardData.callCenter.totalCalls * 0.6),
            answered: Math.floor(dashboardData.callCenter.answeredCalls * 0.6),
            abandoned: Math.floor(dashboardData.callCenter.abandonedCalls * 0.6),
            serviceLevel: Math.floor(dashboardData.callCenter.serviceLevel)
          },
          {
            period: "Today",
            calls: dashboardData.callCenter.totalCalls,
            answered: dashboardData.callCenter.answeredCalls,
            abandoned: dashboardData.callCenter.abandonedCalls,
            serviceLevel: Math.floor(dashboardData.callCenter.serviceLevel)
          },
          {
            period: "This Week",
            calls: Math.floor(dashboardData.callCenter.totalCalls * 7),
            answered: Math.floor(dashboardData.callCenter.answeredCalls * 7),
            abandoned: Math.floor(dashboardData.callCenter.abandonedCalls * 7),
            serviceLevel: Math.floor(dashboardData.callCenter.serviceLevel)
          }
        ],
        lastUpdated: dashboardData.refreshDate.toISOString()
      };

      // Format queue performance data
      const queuePerformance = {
        overview: {
          totalQueues: dashboardData.queues.length,
          activeQueues: dashboardData.queues.filter(q => q.totalCalls > 0).length,
          totalCalls: dashboardData.queues.reduce((sum, q) => sum + q.totalCalls, 0),
          averageWaitTime: this.formatSeconds(
            dashboardData.queues.reduce((sum, q) => sum + q.averageWaitTime, 0) / dashboardData.queues.length
          ),
          serviceLevel: `${Math.floor(
            dashboardData.queues.reduce((sum, q) => sum + q.serviceLevel, 0) / dashboardData.queues.length
          )}%`,
          lastUpdated: dashboardData.refreshDate.toISOString()
        },
        queues: dashboardData.queues.map(queue => ({
          id: queue.queueId.toString(),
          name: queue.queueName,
          totalCalls: queue.totalCalls,
          answeredCalls: queue.answeredCalls,
          abandonedCalls: queue.abandonedCalls,
          serviceLevel: `${Math.floor(queue.serviceLevel)}%`,
          averageWaitTime: this.formatSeconds(queue.averageWaitTime),
          averageHandleTime: this.formatSeconds(queue.averageHandleTime),
          longestWaitTime: this.formatSeconds(queue.longestWaitTime),
          status: queue.serviceLevel >= 80 ? 'good' : queue.serviceLevel >= 60 ? 'fair' : 'poor'
        })),
        lastUpdated: dashboardData.refreshDate.toISOString()
      };

      // Format agent performance data
      const agentPerformance = {
        overview: {
          totalAgents: dashboardData.agents.length,
          activeAgents: dashboardData.agents.filter(a => a.totalCalls > 0).length,
          totalCalls: dashboardData.agents.reduce((sum, a) => sum + a.totalCalls, 0),
          averageHandleTime: this.formatSeconds(
            dashboardData.agents.reduce((sum, a) => sum + a.averageHandleTime, 0) / dashboardData.agents.length
          ),
          averageSatisfaction: dashboardData.agents.length > 0 ? 
            (dashboardData.agents.reduce((sum, a) => sum + a.satisfaction, 0) / dashboardData.agents.length).toFixed(1) : '0.0',
          lastUpdated: dashboardData.refreshDate.toISOString()
        },
        agents: dashboardData.agents.map(agent => ({
          id: agent.agentId.toString(),
          name: agent.agentName,
          totalCalls: agent.totalCalls,
          answeredCalls: agent.answeredCalls,
          averageHandleTime: this.formatSeconds(agent.averageHandleTime),
          averageTalkTime: this.formatSeconds(agent.averageTalkTime),
          averageWrapTime: this.formatSeconds(agent.averageWrapTime),
          satisfaction: agent.satisfaction.toFixed(1),
          qualityScore: Math.floor(agent.qualityScore),
          adherence: `${Math.floor(agent.adherence)}%`,
          status: agent.qualityScore >= 80 ? 'excellent' : agent.qualityScore >= 60 ? 'good' : 'needs_improvement'
        })),
        lastUpdated: dashboardData.refreshDate.toISOString()
      };

      // Include analysis data if available
      const insights = analysisData ? {
        strengths: analysisData.insights.strengths,
        weaknesses: analysisData.insights.weaknesses,
        opportunities: analysisData.insights.opportunities,
        threats: analysisData.insights.threats,
        recommendations: analysisData.insights.recommendations,
        lastUpdated: analysisData.refreshDate.toISOString()
      } : {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        recommendations: [],
        lastUpdated: new Date().toISOString()
      };

      return {
        callCenterStatusToday,
        callCenterPerformance,
        queuePerformance,
        agentPerformance,
        insights,
        lastUpdated: dashboardData.refreshDate.toISOString()
      };

    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw error;
    }
  }
}