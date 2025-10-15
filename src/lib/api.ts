// API utility functions for the dashboard
import { useState, useEffect } from 'react'

export interface DashboardData {
  company: {
    name: string
    queues: Array<{
      id: string
      name: string
      status: string
      agents: number
      waitingCalls: number
      longestWait: string
      serviceLevel: string
    }>
    settings: {
      generalSettings: {
        integrationEnabled: boolean
        genesysEnvironment: string
        lastUpdated: string
      }
      usersManagement: {
        totalUsers: number
        activeUsers: number
        roles: string[]
        lastUpdated: string
      }
      notifications: {
        emailAlerts: boolean
        smsAlerts: boolean
        inAppNotifications: boolean
        lastUpdated: string
      }
    }
  }
  userProfile: {
    id: string
    name: string
    email: string
    role: string
    department: string
    lastLogin: string
    permissions: string[]
    preferences: {
      theme: string
      language: string
      timezone: string
      notifications: {
        email: boolean
        sms: boolean
        desktop: boolean
      }
    }
  }
  dataView: {
    callCenterStatusToday: {
      currentCallStatus: {
        activeCalls: number
        totalAgents: number
        availableAgents: number
        onBreakAgents: number
        inTrainingAgents: number
        utilizationRate: string
        lastUpdated: string
      }
      callOutcomes: {
        answered: number
        abandoned: number
        transferred: number
        voicemail: number
        total: number
        answerRate: string
        lastUpdated: string
      }
      callHandlingMetrics: {
        averageHandleTime: string
        averageTalkTime: string
        averageWrapUpTime: string
        serviceLevel: string
        firstCallResolution: string
        lastUpdated: string
      }
    }
    callCenterPerformance: {
      overview: {
        totalCalls: number
        answeredCalls: number
        abandonedCalls: number
        serviceLevel: string
        averageWaitTime: string
        lastUpdated: string
      }
      metrics: Array<{
        name: string
        value: string
        trend: string
        change: string
      }>
      lastUpdated: string
    }
    queuePerformance: {
      overview: {
        totalQueues: number
        activeQueues: number
        totalWaiting: number
        longestWait: string
        averageWaitTime: string
        lastUpdated: string
      }
      queues: Array<{
        name: string
        waiting: number
        longestWait: string
        averageWait: string
        serviceLevel: string
        agents: number
      }>
      lastUpdated: string
    }
    agentPerformance: {
      overview: {
        totalAgents: number
        activeAgents: number
        averageUtilization: string
        averageHandleTime: string
        averageTalkTime: string
        lastUpdated: string
      }
      topPerformers: Array<{
        name: string
        callsHandled: number
        averageHandleTime: string
        satisfaction: string
        utilization: string
      }>
      lastUpdated: string
    }
  }
  analytics: {
    callCenterStatusToday: {
      currentCallStatus: {
        activeCalls: number
        totalAgents: number
        availableAgents: number
        onBreakAgents: number
        inTrainingAgents: number
        utilizationRate: string
        lastUpdated: string
      }
      callOutcomes: {
        answered: number
        abandoned: number
        transferred: number
        voicemail: number
        total: number
        answerRate: string
        lastUpdated: string
      }
      callHandlingMetrics: {
        averageHandleTime: string
        averageTalkTime: string
        averageWrapUpTime: string
        serviceLevel: string
        firstCallResolution: string
        lastUpdated: string
      }
    }
    callCenterPerformance: {
      overview: {
        totalCalls: number
        answeredCalls: number
        abandonedCalls: number
        serviceLevel: string
        averageWaitTime: string
        lastUpdated: string
      }
      trends: Array<{
        period: string
        calls: number
        serviceLevel: string
        averageWaitTime: string
      }>
      lastUpdated: string
    }
    queuePerformance: {
      overview: {
        totalQueues: number
        activeQueues: number
        totalWaiting: number
        longestWait: string
        averageWaitTime: string
        lastUpdated: string
      }
      analytics: Array<{
        metric: string
        current: string
        target: string
        status: string
      }>
      lastUpdated: string
    }
    agentPerformance: {
      overview: {
        totalAgents: number
        activeAgents: number
        averageUtilization: string
        averageHandleTime: string
        averageTalkTime: string
        lastUpdated: string
      }
      analytics: Array<{
        metric: string
        current: string
        target: string
        trend: string
      }>
      lastUpdated: string
    }
  }
  metadata: {
    generatedAt: string
    dataFreshness: string
    version: string
    refreshInterval: string
  }
}

export interface RealtimeData {
  timestamp: string
  data: {
    currentCallStatus: {
      activeCalls: number
      totalAgents: number
      availableAgents: number
      onBreakAgents: number
      inTrainingAgents: number
      utilizationRate: string
      lastUpdated: string
    }
    callOutcomes: {
      answered: number
      abandoned: number
      transferred: number
      voicemail: number
      total: number
      answerRate: string
      lastUpdated: string
    }
    callHandlingMetrics: {
      averageHandleTime: string
      averageTalkTime: string
      averageWrapUpTime: string
      serviceLevel: string
      firstCallResolution: string
      lastUpdated: string
    }
    queues: Array<{
      id: string
      name: string
      waiting: number
      longestWait: string
      averageWait: string
      serviceLevel: string
      agents: number
      lastUpdated: string
    }>
    agents: Array<{
      id: string
      name: string
      status: string
      callsHandled: number
      averageHandleTime: string
      satisfaction: string
      utilization: string
      lastUpdated: string
    }>
  }
}

export interface AnalyticsData {
  timestamp: string
  timeRange: string
  category: string
  data: {
    callCenterStatusToday: {
      currentCallStatus: {
        activeCalls: number
        totalAgents: number
        availableAgents: number
        onBreakAgents: number
        inTrainingAgents: number
        utilizationRate: string
        peakUtilization: string
        averageUtilization: string
        lastUpdated: string
      }
      callOutcomes: {
        answered: number
        abandoned: number
        transferred: number
        voicemail: number
        total: number
        answerRate: string
        abandonRate: string
        transferRate: string
        voicemailRate: string
        lastUpdated: string
      }
      callHandlingMetrics: {
        averageHandleTime: string
        averageTalkTime: string
        averageWrapUpTime: string
        serviceLevel: string
        firstCallResolution: string
        averageSpeedToAnswer: string
        lastUpdated: string
      }
      trends: {
        hourlyData: Array<{
          hour: number
          calls: number
          serviceLevel: number
          averageWaitTime: number
        }>
        lastUpdated: string
      }
    }
    callCenterPerformance: {
      overview: {
        totalCalls: number
        answeredCalls: number
        abandonedCalls: number
        serviceLevel: string
        averageWaitTime: string
        averageHandleTime: string
        agentUtilization: string
        forecastAccuracy: string
        lastUpdated: string
      }
      metrics: Array<{
        name: string
        value: string
        target: string
        trend: string
        change: string
        status: string
      }>
      performanceByHour: Array<{
        hour: number
        calls: number
        serviceLevel: number
        averageWaitTime: number
        agentUtilization: number
      }>
      lastUpdated: string
    }
    queuePerformance: {
      overview: {
        totalQueues: number
        activeQueues: number
        totalWaiting: number
        longestWait: string
        averageWaitTime: string
        serviceLevel: string
        totalCalls: number
        answeredCalls: number
        lastUpdated: string
      }
      queueDetails: Array<{
        name: string
        waiting: number
        longestWait: string
        averageWait: string
        serviceLevel: string
        agents: number
        callsToday: number
        answered: number
        abandoned: number
        trend: string
        performance: string
      }>
      efficiencyMetrics: Array<{
        metric: string
        current: string
        target: string
        status: string
        trend: string
      }>
      lastUpdated: string
    }
    agentPerformance: {
      overview: {
        totalAgents: number
        activeAgents: number
        averageUtilization: string
        averageHandleTime: string
        averageTalkTime: string
        averageWrapUpTime: string
        totalCalls: number
        satisfactionScore: string
        qualityScore: string
        adherenceScore: string
        lastUpdated: string
      }
      topPerformers: Array<{
        name: string
        callsHandled: number
        averageHandleTime: string
        satisfaction: string
        utilization: string
        quality: string
        adherence: string
        status: string
      }>
      performanceMetrics: Array<{
        metric: string
        current: string
        target: string
        trend: string
        status: string
      }>
      teamComparison: Array<{
        team: string
        agents: number
        utilization: string
        satisfaction: string
        quality: string
        callsHandled: number
      }>
      lastUpdated: string
    }
  }
}

// API functions
class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''
  }

  async fetchDashboardData(): Promise<DashboardData> {
    const response = await fetch(`${this.baseURL}/api/dashboard`)
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }
    return response.json()
  }

  async fetchRealtimeData(dataType: string = 'all'): Promise<RealtimeData> {
    const response = await fetch(`${this.baseURL}/api/realtime?type=${dataType}`)
    if (!response.ok) {
      throw new Error('Failed to fetch realtime data')
    }
    return response.json()
  }

  async fetchAnalyticsData(category: string = 'all', timeRange: string = 'today'): Promise<AnalyticsData> {
    const response = await fetch(`${this.baseURL}/api/analytics?category=${category}&timeRange=${timeRange}`)
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data')
    }
    return response.json()
  }

  // WebSocket connection for real-time updates
  createWebSocketConnection(): WebSocket {
    const wsURL = process.env.NODE_ENV === 'development' ? 'ws://localhost:3000' : ''
    return new WebSocket(`${wsURL}/api/socketio`)
  }
}

export const apiClient = new APIClient()

// React hook for dashboard data
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// React hook for real-time data
export const useRealtimeData = (dataType: string = 'all', refreshInterval: number = 30000) => {
  const [data, setData] = useState<RealtimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/realtime?type=${dataType}`)
        const realtimeData = await response.json()
        setData(realtimeData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Set up interval for real-time updates
    const interval = setInterval(fetchData, refreshInterval)

    return () => clearInterval(interval)
  }, [dataType, refreshInterval])

  return { data, loading, error }
}

// React hook for analytics data
export const useAnalyticsData = (category: string = 'all', timeRange: string = 'today') => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics?category=${category}&timeRange=${timeRange}`)
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category, timeRange])

  return { data, loading, error }
}