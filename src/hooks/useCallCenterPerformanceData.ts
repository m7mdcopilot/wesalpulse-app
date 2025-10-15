'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface CallCenterPerformanceData {
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
    trends: Array<{
      period: string
      calls: number
      answered: number
      abandoned: number
      serviceLevel: number
    }>
    lastUpdated: string
  }
}

export function useCallCenterPerformanceData() {
  const [data, setData] = useState<CallCenterPerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCallCenterPerformanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/call-center-performance')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const callCenterPerformanceData = await response.json()
      setData(callCenterPerformanceData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch call center performance data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    toast.info('Refreshing call center performance data...')
    fetchCallCenterPerformanceData()
  }

  useEffect(() => {
    fetchCallCenterPerformanceData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData
  }
}