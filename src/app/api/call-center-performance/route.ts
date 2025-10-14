import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { CallData, User, Queue, Company } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    // Get the first company (for demo purposes)
    const company = await Company.findOne({});
    
    if (!company) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }
    
    // Get calls for different time periods
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last6Hours = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get calls for different periods
    const todayCalls = await CallData.find({
      company: company._id,
      'timing.startTime': { $gte: today, $lt: tomorrow }
    });
    
    const lastHourCalls = await CallData.find({
      company: company._id,
      'timing.startTime': { $gte: lastHour }
    });
    
    const last6HoursCalls = await CallData.find({
      company: company._id,
      'timing.startTime': { $gte: last6Hours }
    });
    
    const thisWeekCalls = await CallData.find({
      company: company._id,
      'timing.startTime': { $gte: weekAgo }
    });
    
    // Calculate overview metrics
    const answeredCalls = todayCalls.filter(call => call.status === 'answered' || call.status === 'completed');
    const abandonedCalls = todayCalls.filter(call => call.status === 'abandoned');
    const totalWaitTime = todayCalls.reduce((sum, call) => sum + call.timing.waitTime, 0);
    const averageWaitTime = todayCalls.length > 0 
      ? `${Math.floor(totalWaitTime / todayCalls.length / 60)}:${Math.floor(totalWaitTime / todayCalls.length % 60).toString().padStart(2, '0')}`
      : '0:00';
    const serviceLevel = todayCalls.length > 0 
      ? `${Math.round((answeredCalls.length / todayCalls.length) * 100)}%` 
      : '0%';
    
    const callCenterPerformance = {
      overview: {
        totalCalls: todayCalls.length,
        answeredCalls: answeredCalls.length,
        abandonedCalls: abandonedCalls.length,
        serviceLevel,
        averageWaitTime,
        lastUpdated: new Date().toISOString()
      },
      metrics: [
        {
          name: "Answer Rate",
          value: todayCalls.length > 0 ? `${Math.round((answeredCalls.length / todayCalls.length) * 100)}%` : '0%',
          trend: "stable",
          change: "0%"
        },
        {
          name: "Service Level",
          value: serviceLevel,
          trend: "stable",
          change: "0%"
        },
        {
          name: "Abandon Rate",
          value: todayCalls.length > 0 ? `${Math.round((abandonedCalls.length / todayCalls.length) * 100)}%` : '0%',
          trend: "stable",
          change: "0%"
        },
        {
          name: "Average Wait Time",
          value: averageWaitTime,
          trend: "stable",
          change: "0:00"
        }
      ],
      trends: [
        {
          period: "Last Hour",
          calls: lastHourCalls.length,
          answered: lastHourCalls.filter(call => call.status === 'answered' || call.status === 'completed').length,
          abandoned: lastHourCalls.filter(call => call.status === 'abandoned').length,
          serviceLevel: lastHourCalls.length > 0 ? Math.round((lastHourCalls.filter(call => call.status === 'answered' || call.status === 'completed').length / lastHourCalls.length) * 100) : 0
        },
        {
          period: "Last 6 Hours",
          calls: last6HoursCalls.length,
          answered: last6HoursCalls.filter(call => call.status === 'answered' || call.status === 'completed').length,
          abandoned: last6HoursCalls.filter(call => call.status === 'abandoned').length,
          serviceLevel: last6HoursCalls.length > 0 ? Math.round((last6HoursCalls.filter(call => call.status === 'answered' || call.status === 'completed').length / last6HoursCalls.length) * 100) : 0
        },
        {
          period: "Today",
          calls: todayCalls.length,
          answered: answeredCalls.length,
          abandoned: abandonedCalls.length,
          serviceLevel: todayCalls.length > 0 ? Math.round((answeredCalls.length / todayCalls.length) * 100) : 0
        },
        {
          period: "This Week",
          calls: thisWeekCalls.length,
          answered: thisWeekCalls.filter(call => call.status === 'answered' || call.status === 'completed').length,
          abandoned: thisWeekCalls.filter(call => call.status === 'abandoned').length,
          serviceLevel: thisWeekCalls.length > 0 ? Math.round((thisWeekCalls.filter(call => call.status === 'answered' || call.status === 'completed').length / thisWeekCalls.length) * 100) : 0
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ callCenterPerformance });
  } catch (error) {
    console.error('Error fetching call center performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call center performance' },
      { status: 500 }
    );
  }
}