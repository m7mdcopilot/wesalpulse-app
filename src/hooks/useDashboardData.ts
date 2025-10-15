'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface DashboardData {
  company: {
    id: string
    name: string
    domain: string
    queues: Array<{
      id: string
      name: string
      description: string
      type: string
      status: string
      agents: number
      waitingCalls: number
      longestWait: string
      serviceLevel: string
      metrics: any
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
    preferences: any
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
    }
  }
  analytics: any
  metadata: {
    generatedAt: string
    dataFreshness: string
    version: string
    refreshInterval: string
  }
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    toast.info('Refreshing dashboard data...')
    fetchDashboardData()
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData
  }
}