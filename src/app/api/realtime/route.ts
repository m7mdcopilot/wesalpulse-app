import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('type') || 'all'
    
    // Simulate real-time data updates
    const realtimeData = {
      timestamp: new Date().toISOString(),
      data: {
        currentCallStatus: {
          activeCalls: Math.floor(Math.random() * 10) + 40, // 40-50
          totalAgents: 18,
          availableAgents: Math.floor(Math.random() * 5) + 10, // 10-15
          onBreakAgents: Math.floor(Math.random() * 3) + 3, // 3-6
          inTrainingAgents: Math.floor(Math.random() * 2) + 1, // 1-3
          utilizationRate: `${Math.floor(Math.random() * 15) + 65}%`, // 65-80%
          lastUpdated: new Date().toISOString()
        },
        callOutcomes: {
          answered: Math.floor(Math.random() * 50) + 320, // 320-370
          abandoned: Math.floor(Math.random() * 10) + 20, // 20-30
          transferred: Math.floor(Math.random() * 10) + 40, // 40-50
          voicemail: Math.floor(Math.random() * 5) + 10, // 10-15
          total: Math.floor(Math.random() * 50) + 400, // 400-450
          answerRate: `${(Math.random() * 5 + 77).toFixed(1)}%`, // 77-82%
          lastUpdated: new Date().toISOString()
        },
        callHandlingMetrics: {
          averageHandleTime: `${Math.floor(Math.random() * 2) + 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 4:xx-5:xx
          averageTalkTime: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 3:xx-4:xx
          averageWrapUpTime: `${Math.floor(Math.random() * 1) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 1:xx-2:xx
          serviceLevel: `${Math.floor(Math.random() * 8) + 78}%`, // 78-86%
          firstCallResolution: `${Math.floor(Math.random() * 10) + 73}%`, // 73-83%
          lastUpdated: new Date().toISOString()
        },
        queues: [
          {
            id: "queue_1",
            name: "Sales Queue",
            waiting: Math.floor(Math.random() * 8) + 2, // 2-10
            longestWait: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 2:xx-7:xx
            averageWait: `${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 1:xx-4:xx
            serviceLevel: `${Math.floor(Math.random() * 10) + 80}%`, // 80-90%
            agents: 8,
            lastUpdated: new Date().toISOString()
          },
          {
            id: "queue_2",
            name: "Support Queue",
            waiting: Math.floor(Math.random() * 15) + 5, // 5-20
            longestWait: `${Math.floor(Math.random() * 8) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 5:xx-13:xx
            averageWait: `${Math.floor(Math.random() * 4) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 3:xx-7:xx
            serviceLevel: `${Math.floor(Math.random() * 15) + 65}%`, // 65-80%
            agents: 6,
            lastUpdated: new Date().toISOString()
          },
          {
            id: "queue_3",
            name: "Technical Queue",
            waiting: Math.floor(Math.random() * 6) + 1, // 1-7
            longestWait: `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 1:xx-5:xx
            averageWait: `${Math.floor(Math.random() * 2) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 1:xx-3:xx
            serviceLevel: `${Math.floor(Math.random() * 8) + 87}%`, // 87-95%
            agents: 4,
            lastUpdated: new Date().toISOString()
          }
        ],
        agents: [
          {
            id: "agent_1",
            name: "Sarah Johnson",
            status: ["available", "on_call", "break", "training"][Math.floor(Math.random() * 4)],
            callsHandled: Math.floor(Math.random() * 20) + 60, // 60-80
            averageHandleTime: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 3:xx-5:xx
            satisfaction: (Math.random() * 0.8 + 4.2).toFixed(1), // 4.2-5.0
            utilization: `${Math.floor(Math.random() * 15) + 85}%`, // 85-100%
            lastUpdated: new Date().toISOString()
          },
          {
            id: "agent_2",
            name: "Mike Chen",
            status: ["available", "on_call", "break", "training"][Math.floor(Math.random() * 4)],
            callsHandled: Math.floor(Math.random() * 20) + 50, // 50-70
            averageHandleTime: `${Math.floor(Math.random() * 2) + 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 4:xx-6:xx
            satisfaction: (Math.random() * 0.8 + 4.0).toFixed(1), // 4.0-4.8
            utilization: `${Math.floor(Math.random() * 15) + 80}%`, // 80-95%
            lastUpdated: new Date().toISOString()
          },
          {
            id: "agent_3",
            name: "Emily Davis",
            status: ["available", "on_call", "break", "training"][Math.floor(Math.random() * 4)],
            callsHandled: Math.floor(Math.random() * 20) + 55, // 55-75
            averageHandleTime: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 3:xx-5:xx
            satisfaction: (Math.random() * 0.8 + 4.3).toFixed(1), // 4.3-5.1
            utilization: `${Math.floor(Math.random() * 15) + 82}%`, // 82-97%
            lastUpdated: new Date().toISOString()
          }
        ]
      }
    }

    // Filter data based on requested type
    let responseData = realtimeData
    if (dataType !== 'all') {
      responseData = {
        timestamp: realtimeData.timestamp,
        data: {
          [dataType]: realtimeData.data[dataType]
        }
      }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Realtime API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch realtime data' },
      { status: 500 }
    )
  }
}