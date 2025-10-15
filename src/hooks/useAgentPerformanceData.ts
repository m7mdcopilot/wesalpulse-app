'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface AgentPerformanceData {
  agentPerformance: {
    overview: {
      totalAgents: number
      activeAgents: number
      totalCalls: number
      averageHandleTime: string
      averageSatisfaction: string
      lastUpdated: string
    }
    agents: Array<{
      id: string
      name: string
      totalCalls: number
      answeredCalls: number
      averageHandleTime: string
      averageTalkTime: string
      averageWrapTime: string
      satisfaction: string
      qualityScore: number
      adherence: string
      status: string
    }>
    lastUpdated: string
  }
}

export function useAgentPerformanceData() {
  const [data, setData] = useState<AgentPerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgentPerformanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/agent-performance')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const agentPerformanceData = await response.json()
      setData(agentPerformanceData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agent performance data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    toast.info('Refreshing agent performance data...')
    fetchAgentPerformanceData()
  }

  useEffect(() => {
    fetchAgentPerformanceData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData
  }
}