import { NextRequest, NextResponse } from 'next/server';
import { QueueService } from '@/services/QueueService';

export class QueueController {
  /**
   * Get queue by ID
   */
  static async getQueue(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const queue = await QueueService.getQueueById(params.id);
      
      if (!queue) {
        return NextResponse.json(
          { error: 'Queue not found', message: 'Queue does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: queue
      });
    } catch (error) {
      console.error('Get queue error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch queue' },
        { status: 500 }
      );
    }
  }

  /**
   * Get all queues (with pagination and filtering)
   */
  static async getQueues(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      const type = searchParams.get('type') || '';
      const status = searchParams.get('status') || '';
      const companyId = searchParams.get('companyId') || '';

      const result = await QueueService.getQueues({ 
        page, 
        limit, 
        search, 
        type, 
        status, 
        companyId 
      });

      return NextResponse.json({
        success: true,
        data: result.queues,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get queues error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch queues' },
        { status: 500 }
      );
    }
  }

  /**
   * Create new queue
   */
  static async createQueue(req: NextRequest) {
    try {
      const body = await req.json();

      const queue = await QueueService.createQueue(body);

      return NextResponse.json({
        success: true,
        data: queue,
        message: 'Queue created successfully'
      }, { status: 201 });
    } catch (error) {
      console.error('Create queue error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create queue' },
        { status: 500 }
      );
    }
  }

  /**
   * Update queue
   */
  static async updateQueue(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();

      const queue = await QueueService.updateQueue(params.id, body);

      if (!queue) {
        return NextResponse.json(
          { error: 'Queue not found', message: 'Queue does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: queue,
        message: 'Queue updated successfully'
      });
    } catch (error) {
      console.error('Update queue error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update queue' },
        { status: 500 }
      );
    }
  }

  /**
   * Delete queue
   */
  static async deleteQueue(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const success = await QueueService.deleteQueue(params.id);

      if (!success) {
        return NextResponse.json(
          { error: 'Queue not found', message: 'Queue does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Queue deleted successfully'
      });
    } catch (error) {
      console.error('Delete queue error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to delete queue' },
        { status: 500 }
      );
    }
  }

  /**
   * Get queues by company
   */
  static async getQueuesByCompany(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const type = searchParams.get('type') || '';
      const status = searchParams.get('status') || '';

      const result = await QueueService.getQueuesByCompany(params.companyId, {
        page, limit, type, status
      });

      return NextResponse.json({
        success: true,
        data: result.queues,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get queues by company error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch queues by company' },
        { status: 500 }
      );
    }
  }

  /**
   * Update queue metrics
   */
  static async updateQueueMetrics(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { metrics } = body;

      const queue = await QueueService.updateQueueMetrics(params.id, metrics);

      if (!queue) {
        return NextResponse.json(
          { error: 'Queue not found', message: 'Queue does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: queue,
        message: 'Queue metrics updated successfully'
      });
    } catch (error) {
      console.error('Update queue metrics error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update queue metrics' },
        { status: 500 }
      );
    }
  }

  /**
   * Add agent to queue
   */
  static async addAgentToQueue(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { agentId } = body;

      const queue = await QueueService.addAgentToQueue(params.id, agentId);

      if (!queue) {
        return NextResponse.json(
          { error: 'Queue not found', message: 'Queue does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: queue,
        message: 'Agent added to queue successfully'
      });
    } catch (error) {
      console.error('Add agent to queue error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to add agent to queue' },
        { status: 500 }
      );
    }
  }

  /**
   * Remove agent from queue
   */
  static async removeAgentFromQueue(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { agentId } = body;

      const queue = await QueueService.removeAgentFromQueue(params.id, agentId);

      if (!queue) {
        return NextResponse.json(
          { error: 'Queue not found', message: 'Queue does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: queue,
        message: 'Agent removed from queue successfully'
      });
    } catch (error) {
      console.error('Remove agent from queue error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to remove agent from queue' },
        { status: 500 }
      );
    }
  }
}