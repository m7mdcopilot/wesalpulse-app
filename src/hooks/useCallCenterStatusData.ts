'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface CallCenterStatusData {
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
      metServiceLevel: string
      firstCallResolution: string
      lastUpdated: string
    }
  }
}

export function useCallCenterStatusData() {
  const [data, setData] = useState<CallCenterStatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCallCenterStatusData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/call-center-status')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const callCenterStatusData = await response.json()
      setData(callCenterStatusData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch call center status data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    toast.info('Refreshing call center status data...')
    fetchCallCenterStatusData()
  }

  useEffect(() => {
    fetchCallCenterStatusData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData
  }
}