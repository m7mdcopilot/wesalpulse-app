'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface QueuePerformanceData {
  queuePerformance: {
    overview: {
      totalQueues: number
      activeQueues: number
      totalCalls: number
      averageWaitTime: string
      serviceLevel: string
      lastUpdated: string
    }
    queues: Array<{
      id: string
      name: string
      totalCalls: number
      answeredCalls: number
      abandonedCalls: number
      serviceLevel: string
      averageWaitTime: string
      averageHandleTime: string
      longestWaitTime: string
      status: string
    }>
    lastUpdated: string
  }
}

export function useQueuePerformanceData() {
  const [data, setData] = useState<QueuePerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueuePerformanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/queue-performance')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const queuePerformanceData = await response.json()
      setData(queuePerformanceData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch queue performance data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    toast.info('Refreshing queue performance data...')
    fetchQueuePerformanceData()
  }

  useEffect(() => {
    fetchQueuePerformanceData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData
  }
}