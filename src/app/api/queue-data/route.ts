import { NextRequest, NextResponse } from 'next/server'
import { getQueueMetrics } from '@/lib/genesys-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'last_24_hours'
    const mediaType = searchParams.get('mediaType') || 'all'
    const queueIds = searchParams.get('queueIds')?.split(',').filter(Boolean)

    // Fetch queue metrics from Genesys Cloud API
    const { queueMetrics, summaryMetrics } = await getQueueMetrics(timeRange, mediaType as any, queueIds)

    // Transform data for the frontend
    const transformedQueueData = queueMetrics.map(queue => ({
      queueId: queue.queueId,
      queueName: queue.queueName,
      offered: queue.offered,
      answered: queue.offered > 0 ? (queue.handled / queue.offered) * 100 : 0,
      abandoned: queue.offered > 0 ? (queue.abandoned / queue.offered) * 100 : 0,
      asa: queue.averageWaitTime,
      serviceLevel: queue.serviceLevel,
      avgWait: queue.averageWaitTime,
      avgHandle: queue.averageHandleTime,
      avgTalk: queue.averageHandleTime * 0.7, // Estimated talk time
      avgHold: queue.averageHandleTime * 0.2, // Estimated hold time
      avgACW: queue.averageHandleTime * 0.1, // Estimated ACW time
      hold: Math.round(queue.offered * 0.15), // Estimated holds
      transfer: Math.round(queue.offered * 0.08) // Estimated transfers
    }))

    // Transform summary metrics
    const transformedSummaryMetrics = {
      totalOffered: summaryMetrics.totalOffered,
      totalAnswered: summaryMetrics.totalHandled,
      totalAbandoned: summaryMetrics.totalAbandoned,
      averageWaitTime: summaryMetrics.averageWaitTime,
      averageHandleTime: summaryMetrics.averageHandleTime,
      overallServiceLevel: summaryMetrics.overallServiceLevel,
      totalAgentsAvailable: summaryMetrics.totalAgentsAvailable,
      totalAgentsOnQueue: summaryMetrics.totalAgentsOnQueue
    }

    return NextResponse.json({
      queueData: transformedQueueData,
      summaryMetrics: transformedSummaryMetrics
    })
  } catch (error) {
    console.error('Error fetching queue data:', error)
    
    // Return mock data for development/testing
    const mockQueueData = [
      {
        queueId: '1',
        queueName: 'Sales Support',
        offered: 156,
        answered: 142,
        abandoned: 14,
        asa: 25,
        serviceLevel: 85.2,
        avgWait: 25,
        avgHandle: 245,
        avgTalk: 171,
        avgHold: 49,
        avgACW: 25,
        hold: 23,
        transfer: 12
      },
      {
        queueId: '2',
        queueName: 'Technical Support',
        offered: 203,
        answered: 178,
        abandoned: 25,
        asa: 45,
        serviceLevel: 72.8,
        avgWait: 45,
        avgHandle: 385,
        avgTalk: 269,
        avgHold: 77,
        avgACW: 39,
        hold: 30,
        transfer: 16
      },
      {
        queueId: '3',
        queueName: 'Customer Service',
        offered: 89,
        answered: 82,
        abandoned: 7,
        asa: 18,
        serviceLevel: 91.2,
        avgWait: 18,
        avgHandle: 195,
        avgTalk: 136,
        avgHold: 39,
        avgACW: 20,
        hold: 13,
        transfer: 7
      },
      {
        queueId: '4',
        queueName: 'Billing Support',
        offered: 124,
        answered: 109,
        abandoned: 15,
        asa: 32,
        serviceLevel: 78.5,
        avgWait: 32,
        avgHandle: 280,
        avgTalk: 196,
        avgHold: 56,
        avgACW: 28,
        hold: 18,
        transfer: 10
      },
      {
        queueId: '5',
        queueName: 'Product Support',
        offered: 167,
        answered: 145,
        abandoned: 22,
        asa: 38,
        serviceLevel: 75.4,
        avgWait: 38,
        avgHandle: 320,
        avgTalk: 224,
        avgHold: 64,
        avgACW: 32,
        hold: 25,
        transfer: 13
      },
      {
        queueId: '6',
        queueName: 'Enterprise Support',
        offered: 78,
        answered: 74,
        abandoned: 4,
        asa: 15,
        serviceLevel: 94.8,
        avgWait: 15,
        avgHandle: 420,
        avgTalk: 294,
        avgHold: 84,
        avgACW: 42,
        hold: 12,
        transfer: 6
      },
      {
        queueId: '7',
        queueName: 'Sales Inquiries',
        offered: 145,
        answered: 132,
        abandoned: 13,
        asa: 22,
        serviceLevel: 88.7,
        avgWait: 22,
        avgHandle: 215,
        avgTalk: 150,
        avgHold: 43,
        avgACW: 22,
        hold: 22,
        transfer: 11
      },
      {
        queueId: '8',
        queueName: 'Technical Escalation',
        offered: 56,
        answered: 51,
        abandoned: 5,
        asa: 28,
        serviceLevel: 82.1,
        avgWait: 28,
        avgHandle: 495,
        avgTalk: 346,
        avgHold: 99,
        avgACW: 50,
        hold: 8,
        transfer: 4
      },
      {
        queueId: '9',
        queueName: 'Customer Success',
        offered: 92,
        answered: 87,
        abandoned: 5,
        asa: 20,
        serviceLevel: 89.3,
        avgWait: 20,
        avgHandle: 275,
        avgTalk: 192,
        avgHold: 55,
        avgACW: 28,
        hold: 14,
        transfer: 7
      },
      {
        queueId: '10',
        queueName: 'Billing Disputes',
        offered: 134,
        answered: 118,
        abandoned: 16,
        asa: 35,
        serviceLevel: 76.3,
        avgWait: 35,
        avgHandle: 365,
        avgTalk: 255,
        avgHold: 73,
        avgACW: 37,
        hold: 20,
        transfer: 11
      }
    ]

    const mockSummaryMetrics = {
      totalOffered: 1244,
      totalAnswered: 1118,
      totalAbandoned: 126,
      averageWaitTime: 28,
      averageHandleTime: 319,
      overallServiceLevel: 82.4,
      totalAgentsAvailable: 15,
      totalAgentsOnQueue: 12
    }

    return NextResponse.json({
      queueData: mockQueueData,
      summaryMetrics: mockSummaryMetrics
    })
  }
}