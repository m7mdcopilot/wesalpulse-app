// Types for Genesys Cloud API responses
export interface GenesysQueueMetrics {
  queueId: string
  queueName: string
  mediaType: string
  totalInteractions: number
  offered: number
  handled: number
  abandoned: number
  averageWaitTime: number
  averageHandleTime: number
  serviceLevel: number
  longestWaitTime: number
  occupancy: number
  agentsAvailable: number
  agentsOnQueue: number
}

export interface GenesysSummaryMetrics {
  totalInteractions: number
  totalOffered: number
  totalHandled: number
  totalAbandoned: number
  averageWaitTime: number
  averageHandleTime: number
  overallServiceLevel: number
  totalAgentsAvailable: number
  totalAgentsOnQueue: number
}

export interface GenesysTrendData {
  time: string
  interactions: number
  waitTime: number
  serviceLevel: number
}

export interface TimeRange {
  start: string
  end: string
  interval?: string
}

export type MediaType = 'voice' | 'chat' | 'email' | 'callback' | 'all'

export interface QueueFilters {
  timeRange: TimeRange
  mediaType: MediaType
  queueIds?: string[]
}

class GenesysCloudService {
  private baseUrl: string
  private accessToken: string | null = null

  constructor() {
    this.baseUrl = process.env.GENESYS_CLOUD_API_URL || 'https://api.mypurecloud.com'
  }

  // Authenticate with Genesys Cloud using OAuth 2.0
  async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${process.env.GENESYS_CLIENT_ID}:${process.env.GENESYS_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials'
        })
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  // Ensure we have a valid access token
  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken) {
      await this.authenticate()
    }
  }

  // Generic API request method
  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    await this.ensureAuthenticated()

    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { ...defaultOptions, ...options })
      
      if (response.status === 401) {
        // Token expired, re-authenticate and retry
        await this.authenticate()
        return this.apiRequest(endpoint, options)
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  // Get queue aggregates
  async getQueueAggregates(filters: QueueFilters): Promise<GenesysQueueMetrics[]> {
    const interval = filters.timeRange.interval || 'PT30M' // 30-minute intervals
    
    const requestBody = {
      interval: interval,
      timeRange: {
        start: filters.timeRange.start,
        end: filters.timeRange.end
      },
      groupBy: ['queueId', 'mediaType'],
      metrics: [
        'nOffered',
        'nHandled',
        'nAbandoned',
        'tWait',
        'tHandle',
        'serviceLevel',
        'tLongestWait',
        'occupancy',
        'nAgentsAvailable',
        'nAgentsOnQueue'
      ],
      filter: {
        type: 'or',
        clauses: []
      }
    }

    // Add media type filter if not 'all'
    if (filters.mediaType !== 'all') {
      (requestBody.filter as any).clauses.push({
        type: 'dimension',
        dimension: 'mediaType',
        operator: 'matches',
        value: filters.mediaType
      })
    }

    // Add queue IDs filter if provided
    if (filters.queueIds && filters.queueIds.length > 0) {
      (requestBody.filter as any).clauses.push({
        type: 'dimension',
        dimension: 'queueId',
        operator: 'matches',
        value: filters.queueIds.join(',')
      })
    }

    const response = await this.apiRequest('/api/v2/analytics/queues/aggregates/query', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    // Transform the response to our format
    return response.data.map((item: any) => ({
      queueId: item.queueId,
      queueName: item.queueName || `Queue ${item.queueId}`,
      mediaType: item.mediaType,
      totalInteractions: item.nOffered || 0,
      offered: item.nOffered || 0,
      handled: item.nHandled || 0,
      abandoned: item.nAbandoned || 0,
      averageWaitTime: item.tWait?.avg || 0,
      averageHandleTime: item.tHandle?.avg || 0,
      serviceLevel: item.serviceLevel?.percent || 0,
      longestWaitTime: item.tLongestWait?.max || 0,
      occupancy: item.occupancy?.percent || 0,
      agentsAvailable: item.nAgentsAvailable || 0,
      agentsOnQueue: item.nAgentsOnQueue || 0
    }))
  }

  // Get conversation aggregates for trend data
  async getConversationAggregates(filters: QueueFilters): Promise<GenesysTrendData[]> {
    const requestBody = {
      interval: 'PT1H', // 1-hour intervals for trends
      timeRange: {
        start: filters.timeRange.start,
        end: filters.timeRange.end
      },
      groupBy: ['date'],
      metrics: [
        'nOffered',
        'tWait',
        'serviceLevel'
      ],
      filter: {
        type: 'or',
        clauses: []
      }
    }

    // Add media type filter if not 'all'
    if (filters.mediaType !== 'all') {
      (requestBody.filter as any).clauses.push({
        type: 'dimension',
        dimension: 'mediaType',
        operator: 'matches',
        value: filters.mediaType
      })
    }

    const response = await this.apiRequest('/api/v2/analytics/conversations/aggregates/query', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    // Transform the response to our format
    return response.data.map((item: any) => ({
      time: new Date(item.date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      interactions: item.nOffered || 0,
      waitTime: item.tWait?.avg || 0,
      serviceLevel: item.serviceLevel?.percent || 0
    }))
  }

  // Get summary metrics across all queues
  async getSummaryMetrics(filters: QueueFilters): Promise<GenesysSummaryMetrics> {
    const queueMetrics = await this.getQueueAggregates(filters)
    
    const summary = queueMetrics.reduce((acc, queue) => ({
      totalInteractions: acc.totalInteractions + queue.totalInteractions,
      totalOffered: acc.totalOffered + queue.offered,
      totalHandled: acc.totalHandled + queue.handled,
      totalAbandoned: acc.totalAbandoned + queue.abandoned,
      totalAgentsAvailable: acc.totalAgentsAvailable + queue.agentsAvailable,
      totalAgentsOnQueue: acc.totalAgentsOnQueue + queue.agentsOnQueue
    }), {
      totalInteractions: 0,
      totalOffered: 0,
      totalHandled: 0,
      totalAbandoned: 0,
      averageWaitTime: 0,
      averageHandleTime: 0,
      overallServiceLevel: 0,
      totalAgentsAvailable: 0,
      totalAgentsOnQueue: 0
    })

    // Calculate averages
    summary.averageWaitTime = queueMetrics.reduce((sum, queue) => sum + queue.averageWaitTime, 0) / queueMetrics.length
    summary.averageHandleTime = queueMetrics.reduce((sum, queue) => sum + queue.averageHandleTime, 0) / queueMetrics.length
    summary.overallServiceLevel = queueMetrics.reduce((sum, queue) => sum + queue.serviceLevel, 0) / queueMetrics.length

    return summary
  }

  // Get list of available queues
  async getQueues(): Promise<{ id: string; name: string; mediaTypes: string[] }[]> {
    const response = await this.apiRequest('/api/v2/routing/queues?pageSize=100')
    return response.entities.map((queue: any) => ({
      id: queue.id,
      name: queue.name,
      mediaTypes: queue.mediaTypes || []
    }))
  }

  // Helper method to create time range
  createTimeRange(range: string): TimeRange {
    const now = new Date()
    let start: Date

    switch (range) {
      case 'last_hour':
        start = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case 'last_24_hours':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'last_7_days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000) // Default to last 24 hours
    }

    return {
      start: start.toISOString(),
      end: now.toISOString(),
      interval: range === 'last_hour' ? 'PT5M' : 'PT30M'
    }
  }
}

// Export singleton instance
export const genesysCloudService = new GenesysCloudService()

// Export convenience functions
export const getQueueMetrics = async (timeRange: string, mediaType: MediaType = 'all', queueIds?: string[]) => {
  const filters: QueueFilters = {
    timeRange: genesysCloudService.createTimeRange(timeRange),
    mediaType,
    queueIds
  }
  
  const [queueMetrics, summaryMetrics, trendData] = await Promise.all([
    genesysCloudService.getQueueAggregates(filters),
    genesysCloudService.getSummaryMetrics(filters),
    genesysCloudService.getConversationAggregates(filters)
  ])

  return {
    queueMetrics,
    summaryMetrics,
    trendData
  }
}

// Export function to get available queues
export const getQueues = async () => {
  return await genesysCloudService.getQueues()
}