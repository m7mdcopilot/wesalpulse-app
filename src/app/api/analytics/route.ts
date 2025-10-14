import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const timeRange = searchParams.get('timeRange') || 'today'
    
    const analyticsData = {
      timestamp: new Date().toISOString(),
      timeRange,
      category,
      data: {
        callCenterStatusToday: {
          currentCallStatus: {
            activeCalls: 45,
            totalAgents: 18,
            availableAgents: 12,
            onBreakAgents: 4,
            inTrainingAgents: 2,
            utilizationRate: "67%",
            peakUtilization: "78%",
            averageUtilization: "71%",
            lastUpdated: new Date().toISOString()
          },
          callOutcomes: {
            answered: 342,
            abandoned: 28,
            transferred: 45,
            voicemail: 15,
            total: 430,
            answerRate: "79.5%",
            abandonRate: "20.5%",
            transferRate: "10.5%",
            voicemailRate: "3.5%",
            lastUpdated: new Date().toISOString()
          },
          callHandlingMetrics: {
            averageHandleTime: "4:32",
            averageTalkTime: "3:18",
            averageWrapUpTime: "1:14",
            serviceLevel: "82%",
            firstCallResolution: "78%",
            averageSpeedToAnswer: "0:45",
            lastUpdated: new Date().toISOString()
          },
          trends: {
            hourlyData: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              calls: Math.floor(Math.random() * 50) + 20,
              serviceLevel: Math.floor(Math.random() * 20) + 70,
              averageWaitTime: Math.floor(Math.random() * 180) + 30
            })),
            lastUpdated: new Date().toISOString()
          }
        },
        callCenterPerformance: {
          overview: {
            totalCalls: 1245,
            answeredCalls: 987,
            abandonedCalls: 258,
            serviceLevel: "79.3%",
            averageWaitTime: "2:45",
            averageHandleTime: "4:32",
            agentUtilization: "75%",
            forecastAccuracy: "92%",
            lastUpdated: new Date().toISOString()
          },
          metrics: [
            {
              name: "Answer Rate",
              value: "79.3%",
              target: "80%",
              trend: "up",
              change: "+2.1%",
              status: "improving"
            },
            {
              name: "Service Level",
              value: "82%",
              target: "80%",
              trend: "stable",
              change: "0%",
              status: "on_target"
            },
            {
              name: "Abandon Rate",
              value: "20.7%",
              target: "20%",
              trend: "down",
              change: "-1.8%",
              status: "improving"
            },
            {
              name: "Average Wait Time",
              value: "2:45",
              target: "3:00",
              trend: "down",
              change: "-0:30",
              status: "improving"
            },
            {
              name: "Agent Utilization",
              value: "75%",
              target: "70%",
              trend: "up",
              change: "+3%",
              status: "exceeding"
            },
            {
              name: "First Call Resolution",
              value: "78%",
              target: "75%",
              trend: "up",
              change: "+2%",
              status: "exceeding"
            }
          ],
          performanceByHour: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            calls: Math.floor(Math.random() * 60) + 30,
            serviceLevel: Math.floor(Math.random() * 15) + 75,
            averageWaitTime: Math.floor(Math.random() * 120) + 60,
            agentUtilization: Math.floor(Math.random() * 20) + 65
          })),
          lastUpdated: new Date().toISOString()
        },
        queuePerformance: {
          overview: {
            totalQueues: 12,
            activeQueues: 10,
            totalWaiting: 67,
            longestWait: "12:30",
            averageWaitTime: "4:15",
            serviceLevel: "82%",
            totalCalls: 1245,
            answeredCalls: 987,
            lastUpdated: new Date().toISOString()
          },
          queueDetails: [
            {
              name: "Sales Queue",
              waiting: 5,
              longestWait: "3:45",
              averageWait: "2:20",
              serviceLevel: "85%",
              agents: 8,
              callsToday: 245,
              answered: 208,
              abandoned: 37,
              trend: "stable",
              performance: "good"
            },
            {
              name: "Support Queue",
              waiting: 12,
              longestWait: "7:20",
              averageWait: "4:45",
              serviceLevel: "72%",
              agents: 6,
              callsToday: 387,
              answered: 279,
              abandoned: 108,
              trend: "degrading",
              performance: "poor"
            },
            {
              name: "Technical Queue",
              waiting: 3,
              longestWait: "2:15",
              averageWait: "1:50",
              serviceLevel: "91%",
              agents: 4,
              callsToday: 156,
              answered: 142,
              abandoned: 14,
              trend: "improving",
              performance: "excellent"
            },
            {
              name: "Billing Queue",
              waiting: 8,
              longestWait: "5:30",
              averageWait: "3:15",
              serviceLevel: "78%",
              agents: 5,
              callsToday: 198,
              answered: 154,
              abandoned: 44,
              trend: "stable",
              performance: "fair"
            }
          ],
          efficiencyMetrics: [
            {
              metric: "Queue Efficiency",
              current: "78%",
              target: "85%",
              status: "below_target",
              trend: "stable"
            },
            {
              metric: "Abandon Rate",
              current: "15.2%",
              target: "10%",
              status: "above_target",
              trend: "improving"
            },
            {
              metric: "Service Level",
              current: "82%",
              target: "80%",
              status: "above_target",
              trend: "stable"
            },
            {
              metric: "Agent Utilization",
              current: "75%",
              target: "70%",
              status: "above_target",
              trend: "improving"
            }
          ],
          lastUpdated: new Date().toISOString()
        },
        agentPerformance: {
          overview: {
            totalAgents: 24,
            activeAgents: 18,
            averageUtilization: "75%",
            averageHandleTime: "4:32",
            averageTalkTime: "3:18",
            averageWrapUpTime: "1:14",
            totalCalls: 1245,
            satisfactionScore: "4.6/5",
            qualityScore: "88%",
            adherenceScore: "92%",
            lastUpdated: new Date().toISOString()
          },
          topPerformers: [
            {
              name: "Sarah Johnson",
              callsHandled: 67,
              averageHandleTime: "3:45",
              satisfaction: "4.8",
              utilization: "92%",
              quality: "92%",
              adherence: "95%",
              status: "excellent"
            },
            {
              name: "Mike Chen",
              callsHandled: 58,
              averageHandleTime: "4:12",
              satisfaction: "4.6",
              utilization: "88%",
              quality: "87%",
              adherence: "90%",
              status: "excellent"
            },
            {
              name: "Emily Davis",
              callsHandled: 54,
              averageHandleTime: "4:08",
              satisfaction: "4.7",
              utilization: "85%",
              quality: "89%",
              adherence: "88%",
              status: "good"
            },
            {
              name: "David Wilson",
              callsHandled: 62,
              averageHandleTime: "4:25",
              satisfaction: "4.5",
              utilization: "90%",
              quality: "85%",
              adherence: "92%",
              status: "good"
            },
            {
              name: "Lisa Anderson",
              callsHandled: 49,
              averageHandleTime: "3:58",
              satisfaction: "4.9",
              utilization: "82%",
              quality: "94%",
              adherence: "87%",
              status: "excellent"
            }
          ],
          performanceMetrics: [
            {
              metric: "Productivity Score",
              current: "82%",
              target: "85%",
              trend: "improving",
              status: "below_target"
            },
            {
              metric: "Quality Score",
              current: "88%",
              target: "85%",
              trend: "stable",
              status: "above_target"
            },
            {
              metric: "Customer Satisfaction",
              current: "4.6/5",
              target: "4.5/5",
              trend: "improving",
              status: "above_target"
            },
            {
              metric: "Adherence to Schedule",
              current: "92%",
              target: "90%",
              trend: "stable",
              status: "above_target"
            },
            {
              metric: "Average Handle Time",
              current: "4:32",
              target: "5:00",
              trend: "improving",
              status: "above_target"
            }
          ],
          teamComparison: [
            {
              team: "Sales Team",
              agents: 8,
              utilization: "78%",
              satisfaction: "4.7",
              quality: "89%",
              callsHandled: 345
            },
            {
              team: "Support Team",
              agents: 6,
              utilization: "82%",
              satisfaction: "4.4",
              quality: "86%",
              callsHandled: 287
            },
            {
              team: "Technical Team",
              agents: 4,
              utilization: "71%",
              satisfaction: "4.8",
              quality: "91%",
              callsHandled: 198
            }
          ],
          lastUpdated: new Date().toISOString()
        }
      }
    }

    // Filter data based on requested category
    let responseData = analyticsData
    if (category !== 'all') {
      responseData = {
        timestamp: analyticsData.timestamp,
        timeRange: analyticsData.timeRange,
        category,
        data: {
          [category]: analyticsData.data[category]
        }
      }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}