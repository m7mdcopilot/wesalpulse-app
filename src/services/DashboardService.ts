import { Dashboard, Company, User, Queue, CallData, Analytics } from '@/models';
import { DBService } from '@/lib/mongodb';
import { DataCollectionService } from './DataCollectionService';

export interface DashboardFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  companyId?: string;
  isPublic?: boolean;
}

export interface CreateDashboardData {
  name: string;
  description?: string;
  type?: 'main' | 'call-center' | 'queue-performance' | 'agent-performance' | 'custom';
  isDefault?: boolean;
  isPublic?: boolean;
  company: string;
  createdBy: string;
  layout?: {
    version?: string;
    widgets?: Array<{
      id: string;
      type: string;
      title: string;
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      config: {
        dataSource: string;
        filters?: Record<string, any>;
        refreshInterval?: number;
        chartType?: string;
        showLegend?: boolean;
        showGrid?: boolean;
        colorScheme?: string;
      };
      isVisible?: boolean;
      isMinimized?: boolean;
    }>;
  };
  filters?: {
    dateRange?: {
      start: Date;
      end: Date;
      preset?: string;
    };
    queues?: string[];
    agents?: string[];
    callTypes?: string[];
    statuses?: string[];
    customFilters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  settings?: {
    refreshInterval?: number;
    autoRefresh?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    density?: 'compact' | 'normal' | 'comfortable';
    showTooltips?: boolean;
    enableAnimations?: boolean;
  };
  permissions?: {
    viewers?: string[];
    editors?: string[];
    admins?: string[];
  };
}

export interface UpdateDashboardData {
  name?: string;
  description?: string;
  type?: 'main' | 'call-center' | 'queue-performance' | 'agent-performance' | 'custom';
  isDefault?: boolean;
  isPublic?: boolean;
  layout?: {
    version?: string;
    widgets?: Array<{
      id: string;
      type: string;
      title: string;
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      config: {
        dataSource: string;
        filters?: Record<string, any>;
        refreshInterval?: number;
        chartType?: string;
        showLegend?: boolean;
        showGrid?: boolean;
        colorScheme?: string;
      };
      isVisible?: boolean;
      isMinimized?: boolean;
    }>;
  };
  filters?: {
    dateRange?: {
      start: Date;
      end: Date;
      preset?: string;
    };
    queues?: string[];
    agents?: string[];
    callTypes?: string[];
    statuses?: string[];
    customFilters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  settings?: {
    refreshInterval?: number;
    autoRefresh?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    density?: 'compact' | 'normal' | 'comfortable';
    showTooltips?: boolean;
    enableAnimations?: boolean;
  };
  permissions?: {
    viewers?: string[];
    editors?: string[];
    admins?: string[];
  };
}

export class DashboardService {
  /**
   * Get dashboard by ID
   */
  static async getDashboardById(id: string) {
    return await DBService.findById(Dashboard, id);
  }

  /**
   * Get dashboards with filtering and pagination
   */
  static async getDashboards(filters: DashboardFilters = {}) {
    const { page = 1, limit = 10, search = '', type = '', companyId = '', isPublic } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    if (companyId) {
      query.company = companyId;
    }

    if (typeof isPublic === 'boolean') {
      query.isPublic = isPublic;
    }

    const [dashboards, total] = await Promise.all([
      DBService.find(Dashboard, query, { 
        skip, 
        limit,
        sort: { lastAccessed: -1 }
      }),
      DBService.count(Dashboard, query)
    ]);

    return { dashboards, total };
  }

  /**
   * Create new dashboard
   */
  static async createDashboard(data: CreateDashboardData) {
    // Prepare dashboard data with defaults
    const dashboardData = {
      ...data,
      type: data.type || 'custom',
      isDefault: data.isDefault || false,
      isPublic: data.isPublic || false,
      layout: {
        version: data.layout?.version || '1.0',
        widgets: data.layout?.widgets || []
      },
      filters: {
        dateRange: data.filters?.dateRange || {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          end: new Date()
        },
        queues: data.filters?.queues || [],
        agents: data.filters?.agents || [],
        callTypes: data.filters?.callTypes || [],
        statuses: data.filters?.statuses || [],
        customFilters: data.filters?.customFilters || []
      },
      settings: {
        refreshInterval: data.settings?.refreshInterval || 30,
        autoRefresh: data.settings?.autoRefresh || true,
        theme: data.settings?.theme || 'auto',
        density: data.settings?.density || 'normal',
        showTooltips: data.settings?.showTooltips ?? true,
        enableAnimations: data.settings?.enableAnimations ?? true
      },
      permissions: {
        viewers: data.permissions?.viewers || [],
        editors: data.permissions?.editors || [],
        admins: data.permissions?.admins || []
      },
      lastAccessed: new Date(),
      accessCount: 0
    };

    return await DBService.create(Dashboard, dashboardData);
  }

  /**
   * Update dashboard
   */
  static async updateDashboard(id: string, data: UpdateDashboardData) {
    const existingDashboard = await DBService.findById(Dashboard, id);
    if (!existingDashboard) {
      return null;
    }

    return await DBService.update(Dashboard, id, data);
  }

  /**
   * Delete dashboard
   */
  static async deleteDashboard(id: string) {
    const dashboard = await DBService.findById(Dashboard, id);
    if (!dashboard) {
      return false;
    }

    return await DBService.delete(Dashboard, id);
  }

  /**
   * Get dashboards by company
   */
  static async getDashboardsByCompany(companyId: string, filters: Omit<DashboardFilters, 'companyId'> = {}) {
    return await this.getDashboards({ ...filters, companyId });
  }

  /**
   * Get default dashboard for company
   */
  static async getDefaultDashboard(companyId: string) {
    return await DBService.findOne(Dashboard, { 
      company: companyId, 
      isDefault: true 
    });
  }

  /**
   * Update dashboard access statistics
   */
  static async updateDashboardAccess(id: string) {
    const dashboard = await DBService.findById(Dashboard, id);
    if (!dashboard) {
      return null;
    }

    return await DBService.update(Dashboard, id, {
      lastAccessed: new Date(),
      $inc: { accessCount: 1 }
    });
  }

  /**
   * Add widget to dashboard
   */
  static async addWidgetToDashboard(dashboardId: string, widget: any) {
    const dashboard = await DBService.findById(Dashboard, dashboardId);
    if (!dashboard) {
      return null;
    }

    return await DBService.update(Dashboard, dashboardId, {
      $push: { 'layout.widgets': widget }
    });
  }

  /**
   * Remove widget from dashboard
   */
  static async removeWidgetFromDashboard(dashboardId: string, widgetId: string) {
    const dashboard = await DBService.findById(Dashboard, dashboardId);
    if (!dashboard) {
      return null;
    }

    return await DBService.update(Dashboard, dashboardId, {
      $pull: { 'layout.widgets': { id: widgetId } }
    });
  }

  /**
   * Update widget position in dashboard
   */
  static async updateWidgetPosition(dashboardId: string, widgetId: string, position: any) {
    const dashboard = await DBService.findById(Dashboard, dashboardId);
    if (!dashboard) {
      return null;
    }

    const widgetIndex = dashboard.layout.widgets.findIndex((w: any) => w.id === widgetId);
    if (widgetIndex === -1) {
      throw new Error('Widget not found in dashboard');
    }

    // Update widget position
    const updateQuery = {};
    Object.keys(position).forEach(key => {
      updateQuery[`layout.widgets.${widgetIndex}.position.${key}`] = position[key];
    });

    return await DBService.update(Dashboard, dashboardId, updateQuery);
  }

  /**
   * Get public dashboards
   */
  static async getPublicDashboards() {
    return await this.getDashboards({ isPublic: true });
  }

  /**
   * Get dashboards by user access
   */
  static async getDashboardsByUserAccess(userId: string) {
    return await DBService.find(Dashboard, {
      $or: [
        { createdBy: userId },
        { 'permissions.viewers': userId },
        { 'permissions.editors': userId },
        { 'permissions.admins': userId }
      ]
    });
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStatistics(companyId: string) {
    const [
      totalDashboards,
      publicDashboards,
      defaultDashboards,
      mainDashboards,
      callCenterDashboards,
      queuePerformanceDashboards,
      agentPerformanceDashboards,
      customDashboards
    ] = await Promise.all([
      DBService.count(Dashboard, { company: companyId }),
      DBService.count(Dashboard, { company: companyId, isPublic: true }),
      DBService.count(Dashboard, { company: companyId, isDefault: true }),
      DBService.count(Dashboard, { company: companyId, type: 'main' }),
      DBService.count(Dashboard, { company: companyId, type: 'call-center' }),
      DBService.count(Dashboard, { company: companyId, type: 'queue-performance' }),
      DBService.count(Dashboard, { company: companyId, type: 'agent-performance' }),
      DBService.count(Dashboard, { company: companyId, type: 'custom' })
    ]);

    return {
      total: totalDashboards,
      public: publicDashboards,
      private: totalDashboards - publicDashboards,
      default: defaultDashboards,
      byType: {
        main: mainDashboards,
        'call-center': callCenterDashboards,
        'queue-performance': queuePerformanceDashboards,
        'agent-performance': agentPerformanceDashboards,
        custom: customDashboards
      }
    };
  }

  /**
   * Get real dashboard data from database using pre-calculated collections
   */
  static async getDashboardAnalytics(companyId: string) {
    try {
      // Use DataCollectionService to get pre-calculated dashboard data
      const dashboardData = await DataCollectionService.getDashboardAnalytics(companyId);
      
      return dashboardData;
    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw error;
    }
  }

  /**
   * Format seconds to MM:SS format
   */
  private static formatSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}