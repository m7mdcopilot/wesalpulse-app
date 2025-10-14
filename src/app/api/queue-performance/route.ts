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
    
    // Get all queues for the company
    const queues = await Queue.find({ company: company._id });
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all calls for today
    const todayCalls = await CallData.find({
      company: company._id,
      'timing.startTime': { $gte: today, $lt: tomorrow }
    }).populate('queue');
    
    // Calculate queue performance data
    const queuePerformanceData = queues.map(queue => {
      const queueCalls = todayCalls.filter(call => 
        call.queue && call.queue._id.toString() === queue._id.toString()
      );
      
      const answeredCalls = queueCalls.filter(call => call.status === 'answered' || call.status === 'completed');
      const abandonedCalls = queueCalls.filter(call => call.status === 'abandoned');
      
      const totalWaitTime = queueCalls.reduce((sum, call) => sum + call.timing.waitTime, 0);
      const totalHandleTime = answeredCalls.reduce((sum, call) => sum + call.timing.handleTime, 0);
      const longestWaitTime = Math.max(...queueCalls.map(call => call.timing.waitTime));
      
      const averageWaitTime = queueCalls.length > 0 
        ? `${Math.floor(totalWaitTime / queueCalls.length / 60)}:${Math.floor(totalWaitTime / queueCalls.length % 60).toString().padStart(2, '0')}`
        : '0:00';
      const averageHandleTime = answeredCalls.length > 0 
        ? `${Math.floor(totalHandleTime / answeredCalls.length / 60)}:${Math.floor(totalHandleTime / answeredCalls.length % 60).toString().padStart(2, '0')}`
        : '0:00';
      const longestWaitTimeFormatted = longestWaitTime > 0 
        ? `${Math.floor(longestWaitTime / 60)}:${Math.floor(longestWaitTime % 60).toString().padStart(2, '0')}`
        : '0:00';
      const serviceLevel = queueCalls.length > 0 
        ? `${Math.round((answeredCalls.length / queueCalls.length) * 100)}%` 
        : '0%';
      
      // Determine status based on service level
      let status = 'excellent';
      if (parseInt(serviceLevel) < 70) status = 'poor';
      else if (parseInt(serviceLevel) < 80) status = 'fair';
      else if (parseInt(serviceLevel) < 90) status = 'good';
      
      return {
        id: queue._id.toString(),
        name: queue.name,
        totalCalls: queueCalls.length,
        answeredCalls: answeredCalls.length,
        abandonedCalls: abandonedCalls.length,
        serviceLevel,
        averageWaitTime,
        averageHandleTime,
        longestWaitTime: longestWaitTimeFormatted,
        status
      };
    });
    
    // Calculate overview metrics
    const totalCalls = todayCalls.length;
    const answeredCalls = todayCalls.filter(call => call.status === 'answered' || call.status === 'completed').length;
    const abandonedCalls = todayCalls.filter(call => call.status === 'abandoned').length;
    const totalWaitTime = todayCalls.reduce((sum, call) => sum + call.timing.waitTime, 0);
    const averageWaitTime = totalCalls > 0 
      ? `${Math.floor(totalWaitTime / totalCalls / 60)}:${Math.floor(totalWaitTime / totalCalls % 60).toString().padStart(2, '0')}`
      : '0:00';
    const serviceLevel = totalCalls > 0 
      ? `${Math.round((answeredCalls / totalCalls) * 100)}%` 
      : '0%';
    
    const queuePerformance = {
      overview: {
        totalQueues: queues.length,
        activeQueues: queues.filter(q => q.status === 'active').length,
        totalCalls,
        averageWaitTime,
        serviceLevel,
        lastUpdated: new Date().toISOString()
      },
      queues: queuePerformanceData,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ queuePerformance });
  } catch (error) {
    console.error('Error fetching queue performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue performance' },
      { status: 500 }
    );
  }
}