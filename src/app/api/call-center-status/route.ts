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
    
    // Get all calls for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayCalls = await CallData.find({
      company: company._id,
      'timing.startTime': { $gte: today, $lt: tomorrow }
    }).populate('agent').populate('queue');
    
    // Get active calls (calls that are still ringing or answered but not completed)
    const activeCalls = todayCalls.filter(call => 
      call.status === 'ringing' || call.status === 'answered'
    );
    
    // Get all agents for the company
    const agents = await User.find({ 
      company: company._id,
      status: 'active'
    });
    
    // Calculate current call status
    const currentCallStatus = {
      activeCalls: activeCalls.length,
      totalAgents: agents.length,
      availableAgents: agents.filter(agent => agent.status === 'active').length,
      unavailableAgents: agents.filter(agent => agent.status !== 'active').length,
      onBreakAgents: 0, // This would need to be tracked separately
      inTrainingAgents: 0, // This would need to be tracked separately
      utilizationRate: agents.length > 0 
        ? `${Math.round((activeCalls.length / agents.length) * 100)}%` 
        : '0%',
      lastUpdated: new Date().toISOString()
    };
    
    // Calculate call outcomes
    const answeredCalls = todayCalls.filter(call => call.status === 'answered' || call.status === 'completed');
    const abandonedCalls = todayCalls.filter(call => call.status === 'abandoned');
    const transferredCalls = todayCalls.filter(call => call.metadata.transferred);
    
    const callOutcomes = {
      answered: answeredCalls.length,
      abandoned: abandonedCalls.length,
      transferred: transferredCalls.length,
      voicemail: 0, // This would need to be tracked separately
      total: todayCalls.length,
      answerRate: todayCalls.length > 0 
        ? `${Math.round((answeredCalls.length / todayCalls.length) * 100)}%` 
        : '0%',
      lastUpdated: new Date().toISOString()
    };
    
    // Calculate call handling metrics
    const totalHandleTime = answeredCalls.reduce((sum, call) => sum + call.timing.handleTime, 0);
    const totalTalkTime = answeredCalls.reduce((sum, call) => sum + call.timing.talkTime, 0);
    const averageHandleTime = answeredCalls.length > 0 
      ? `${Math.floor(totalHandleTime / answeredCalls.length / 60)}:${Math.floor(totalHandleTime / answeredCalls.length % 60).toString().padStart(2, '0')}`
      : '0:00';
    const averageTalkTime = answeredCalls.length > 0 
      ? `${Math.floor(totalTalkTime / answeredCalls.length / 60)}:${Math.floor(totalTalkTime / answeredCalls.length % 60).toString().padStart(2, '0')}`
      : '0:00';
    const averageWrapUpTime = answeredCalls.length > 0 
      ? `${Math.floor((totalHandleTime - totalTalkTime) / answeredCalls.length / 60)}:${Math.floor((totalHandleTime - totalTalkTime) / answeredCalls.length % 60).toString().padStart(2, '0')}`
      : '0:00';
    
    const serviceLevel = todayCalls.length > 0 
      ? `${Math.round((answeredCalls.length / todayCalls.length) * 100)}%` 
      : '0%';
    
    const callHandlingMetrics = {
      averageHandleTime,
      averageTalkTime,
      averageWrapUpTime,
      serviceLevel,
      metServiceLevel: serviceLevel,
      firstCallResolution: '77%', // This would need to be calculated based on resolution data
      lastUpdated: new Date().toISOString()
    };
    
    // Create response data
    const callCenterStatusToday = {
      currentCallStatus,
      callOutcomes,
      callHandlingMetrics
    };
    
    // Add user profile and company information
    const userProfile = {
      name: "Admin User",
      email: "admin@wesalpulse.com",
      role: "Administrator"
    };

    return NextResponse.json({ 
      callCenterStatusToday,
      userProfile,
      company: {
        name: company.name,
        id: company._id
      }
    });
  } catch (error) {
    console.error('Error fetching call center status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call center status' },
      { status: 500 }
    );
  }
}