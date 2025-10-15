import { Company, ICompany } from '@/models';
import { DBService } from '@/lib/mongodb';

export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateCompanyData {
  name: string;
  domain: string;
  settings?: {
    general?: {
      timezone?: string;
      businessHours?: {
        start?: string;
        end?: string;
        days?: number[];
      };
      language?: string;
      currency?: string;
    };
    users?: {
      maxUsers?: number;
      defaultRole?: string;
      requireTwoFactor?: boolean;
    };
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      webhook?: string;
    };
  };
}

export interface UpdateCompanyData {
  name?: string;
  domain?: string;
  settings?: {
    general?: {
      timezone?: string;
      businessHours?: {
        start?: string;
        end?: string;
        days?: number[];
      };
      language?: string;
      currency?: string;
    };
    users?: {
      maxUsers?: number;
      defaultRole?: string;
      requireTwoFactor?: boolean;
    };
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      webhook?: string;
    };
  };
}

export class CompanyService {
  /**
   * Get company by ID
   */
  static async getCompanyById(id: string) {
    return await DBService.findById(Company, id);
  }

  /**
   * Get companies with filtering and pagination
   */
  static async getCompanies(filters: CompanyFilters = {}) {
    const { page = 1, limit = 10, search = '' } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }

    const [companies, total] = await Promise.all([
      DBService.find(Company, query, { 
        skip, 
        limit,
        sort: { createdAt: -1 }
      }),
      DBService.count(Company, query)
    ]);

    return { companies, total };
  }

  /**
   * Create new company
   */
  static async createCompany(data: CreateCompanyData) {
    // Check if company with same domain already exists
    const existingCompany = await DBService.findOne(Company, { 
      domain: data.domain.toLowerCase() 
    });

    if (existingCompany) {
      throw new Error('Company with this domain already exists');
    }

    // Prepare company data with defaults
    const companyData = {
      ...data,
      domain: data.domain.toLowerCase(),
      settings: {
        general: {
          timezone: data.settings?.general?.timezone || 'UTC',
          businessHours: {
            start: data.settings?.general?.businessHours?.start || '09:00',
            end: data.settings?.general?.businessHours?.end || '17:00',
            days: data.settings?.general?.businessHours?.days || [1, 2, 3, 4, 5]
          },
          language: data.settings?.general?.language || 'en',
          currency: data.settings?.general?.currency || 'USD'
        },
        users: {
          maxUsers: data.settings?.users?.maxUsers || 10,
          defaultRole: data.settings?.users?.defaultRole || 'agent',
          requireTwoFactor: data.settings?.users?.requireTwoFactor || false
        },
        notifications: {
          email: data.settings?.notifications?.email ?? true,
          sms: data.settings?.notifications?.sms ?? true,
          push: data.settings?.notifications?.push ?? true,
          webhook: data.settings?.notifications?.webhook || ''
        }
      }
    };

    return await DBService.create(Company, companyData);
  }

  /**
   * Update company
   */
  static async updateCompany(id: string, data: UpdateCompanyData) {
    const existingCompany = await DBService.findById(Company, id);
    if (!existingCompany) {
      return null;
    }

    // Check domain uniqueness if domain is being updated
    if (data.domain && data.domain !== existingCompany.domain) {
      const domainExists = await DBService.findOne(Company, { 
        domain: data.domain.toLowerCase(),
        _id: { $ne: id }
      });

      if (domainExists) {
        throw new Error('Company with this domain already exists');
      }
    }

    const updateData: any = { ...data };
    
    if (data.domain) {
      updateData.domain = data.domain.toLowerCase();
    }

    return await DBService.update(Company, id, updateData);
  }

  /**
   * Delete company
   */
  static async deleteCompany(id: string) {
    const company = await DBService.findById(Company, id);
    if (!company) {
      return false;
    }

    return await DBService.delete(Company, id);
  }

  /**
   * Get company settings
   */
  static async getCompanySettings(id: string) {
    const company = await DBService.findById(Company, id);
    return company?.settings || null;
  }

  /**
   * Update company settings
   */
  static async updateCompanySettings(id: string, settings: any) {
    const company = await DBService.findById(Company, id);
    if (!company) {
      return null;
    }

    return await DBService.update(Company, id, { settings });
  }

  /**
   * Get company with populated relations
   */
  static async getCompanyWithRelations(id: string) {
    return await DBService.findOne(Company, { _id: id }, {
      populate: [
        { path: 'users', select: '-password' },
        { path: 'queues', populate: { path: 'agents', select: '-password' } }
      ]
    });
  }

  /**
   * Get company statistics
   */
  static async getCompanyStatistics(id: string) {
    const company = await DBService.findById(Company, id);
    if (!company) {
      return null;
    }

    // This would typically involve aggregation queries
    // For now, return basic structure
    return {
      totalUsers: 0, // To be implemented with User aggregation
      totalQueues: 0, // To be implemented with Queue aggregation
      totalCalls: 0, // To be implemented with CallData aggregation
      createdAt: company.createdAt,
      lastActivity: company.updatedAt
    };
  }
}