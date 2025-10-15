import { Queue } from '@/models';
import { DBService } from '@/lib/mongodb';

export interface QueueFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  companyId?: string;
}

export interface CreateQueueData {
  name: string;
  description?: string;
  type?: 'inbound' | 'outbound' | 'blended';
  status?: 'active' | 'inactive' | 'maintenance';
  settings?: {
    maxWaitTime?: number;
    serviceLevel?: number;
    overflow?: {
      enabled?: boolean;
      targetQueue?: string;
      waitTime?: number;
    };
    callback?: {
      enabled?: boolean;
      maxAttempts?: number;
      interval?: number;
    };
    recording?: {
      enabled?: boolean;
      quality?: 'low' | 'medium' | 'high';
      retention?: number;
    };
  };
  agents?: string[];
  company: string;
}

export interface UpdateQueueData {
  name?: string;
  description?: string;
  type?: 'inbound' | 'outbound' | 'blended';
  status?: 'active' | 'inactive' | 'maintenance';
  settings?: {
    maxWaitTime?: number;
    serviceLevel?: number;
    overflow?: {
      enabled?: boolean;
      targetQueue?: string;
      waitTime?: number;
    };
    callback?: {
      enabled?: boolean;
      maxAttempts?: number;
      interval?: number;
    };
    recording?: {
      enabled?: boolean;
      quality?: 'low' | 'medium' | 'high';
      retention?: number;
    };
  };
  agents?: string[];
}

export class QueueService {
  /**
   * Get queue by ID
   */
  static async getQueueById(id: string) {
    return await DBService.findById(Queue, id);
  }

  /**
   * Get queues with filtering and pagination
   */
  static async getQueues(filters: QueueFilters = {}) {
    const { page = 1, limit = 10, search = '', type = '', status = '', companyId = '' } = filters;
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

    if (status) {
      query.status = status;
    }

    if (companyId) {
      query.company = companyId;
    }

    const [queues, total] = await Promise.all([
      DBService.find(Queue, query, { 
        skip, 
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'agents', select: '-password' }
        ]
      }),
      DBService.count(Queue, query)
    ]);

    return { queues, total };
  }

  /**
   * Create new queue
   */
  static async createQueue(data: CreateQueueData) {
    // Check if queue with same name already exists in the company
    const existingQueue = await DBService.findOne(Queue, { 
      name: data.name,
      company: data.company 
    });

    if (existingQueue) {
      throw new Error('Queue with this name already exists in this company');
    }

    // Prepare queue data with defaults
    const queueData = {
      ...data,
      type: data.type || 'inbound',
      status: data.status || 'active',
      settings: {
        maxWaitTime: data.settings?.maxWaitTime || 300,
        serviceLevel: data.settings?.serviceLevel || 80,
        overflow: {
          enabled: data.settings?.overflow?.enabled || false,
          targetQueue: data.settings?.overflow?.targetQueue || null,
          waitTime: data.settings?.overflow?.waitTime || 180
        },
        callback: {
          enabled: data.settings?.callback?.enabled || false,
          maxAttempts: data.settings?.callback?.maxAttempts || 3,
          interval: data.settings?.callback?.interval || 30
        },
        recording: {
          enabled: data.settings?.recording?.enabled || true,
          quality: data.settings?.recording?.quality || 'medium',
          retention: data.settings?.recording?.retention || 90
        }
      },
      metrics: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        serviceLevel: 0,
        lastUpdated: new Date()
      },
      agents: data.agents || []
    };

    return await DBService.create(Queue, queueData);
  }

  /**
   * Update queue
   */
  static async updateQueue(id: string, data: UpdateQueueData) {
    const existingQueue = await DBService.findById(Queue, id);
    if (!existingQueue) {
      return null;
    }

    // Check name uniqueness if name is being updated
    if (data.name && data.name !== existingQueue.name) {
      const nameExists = await DBService.findOne(Queue, { 
        name: data.name,
        company: existingQueue.company,
        _id: { $ne: id }
      });

      if (nameExists) {
        throw new Error('Queue with this name already exists in this company');
      }
    }

    const updateData: any = { ...data };

    // Update metrics timestamp if settings are changed
    if (data.settings) {
      updateData['metrics.lastUpdated'] = new Date();
    }

    return await DBService.update(Queue, id, updateData);
  }

  /**
   * Delete queue
   */
  static async deleteQueue(id: string) {
    const queue = await DBService.findById(Queue, id);
    if (!queue) {
      return false;
    }

    return await DBService.delete(Queue, id);
  }

  /**
   * Get queues by company
   */
  static async getQueuesByCompany(companyId: string, filters: Omit<QueueFilters, 'companyId'> = {}) {
    return await this.getQueues({ ...filters, companyId });
  }

  /**
   * Update queue metrics
   */
  static async updateQueueMetrics(id: string, metrics: any) {
    const queue = await DBService.findById(Queue, id);
    if (!queue) {
      return null;
    }

    const updateData = {
      metrics: {
        ...queue.metrics,
        ...metrics,
        lastUpdated: new Date()
      }
    };

    return await DBService.update(Queue, id, updateData);
  }

  /**
   * Add agent to queue
   */
  static async addAgentToQueue(queueId: string, agentId: string) {
    const queue = await DBService.findById(Queue, queueId);
    if (!queue) {
      return null;
    }

    // Check if agent is already in queue
    if (queue.agents.includes(agentId)) {
      throw new Error('Agent is already in this queue');
    }

    const updatedQueue = await DBService.update(Queue, queueId, {
      $push: { agents: agentId }
    });

    return updatedQueue;
  }

  /**
   * Remove agent from queue
   */
  static async removeAgentFromQueue(queueId: string, agentId: string) {
    const queue = await DBService.findById(Queue, queueId);
    if (!queue) {
      return null;
    }

    const updatedQueue = await DBService.update(Queue, queueId, {
      $pull: { agents: agentId }
    });

    return updatedQueue;
  }

  /**
   * Get active queues by company
   */
  static async getActiveQueuesByCompany(companyId: string) {
    return await this.getQueuesByCompany(companyId, { status: 'active' });
  }

  /**
   * Get queues by type
   */
  static async getQueuesByType(companyId: string, type: string) {
    return await this.getQueuesByCompany(companyId, { type });
  }

  /**
   * Get queue statistics
   */
  static async getQueueStatistics(companyId: string) {
    const [
      totalQueues,
      activeQueues,
      inboundQueues,
      outboundQueues,
      blendedQueues
    ] = await Promise.all([
      DBService.count(Queue, { company: companyId }),
      DBService.count(Queue, { company: companyId, status: 'active' }),
      DBService.count(Queue, { company: companyId, type: 'inbound' }),
      DBService.count(Queue, { company: companyId, type: 'outbound' }),
      DBService.count(Queue, { company: companyId, type: 'blended' })
    ]);

    return {
      total: totalQueues,
      active: activeQueues,
      inactive: totalQueues - activeQueues,
      byType: {
        inbound: inboundQueues,
        outbound: outboundQueues,
        blended: blendedQueues
      }
    };
  }

  /**
   * Get queue with agents
   */
  static async getQueueWithAgents(queueId: string) {
    return await DBService.findOne(Queue, { _id: queueId }, {
      populate: [
        { path: 'agents', select: '-password' }
      ]
    });
  }

  /**
   * Get queues for agent
   */
  static async getQueuesForAgent(agentId: string) {
    return await DBService.find(Queue, { agents: agentId }, {
      populate: [
        { path: 'agents', select: '-password' }
      ]
    });
  }
}