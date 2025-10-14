import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { CallData, User, Queue, Company } from '@/models';
import mongoose from 'mongoose';

// Demo data generation functions
function generateDemoCompany() {
  return {
    name: 'WesalPulse Demo Company',
    domain: 'wesalpulse-demo.com',
    settings: {
      general: {
        timezone: 'UTC',
        businessHours: {
          start: '09:00',
          end: '17:00',
          days: [1, 2, 3, 4, 5] // Monday to Friday
        },
        language: 'en',
        currency: 'USD'
      },
      users: {
        maxUsers: 50,
        defaultRole: 'agent',
        requireTwoFactor: false
      },
      notifications: {
        email: true,
        sms: true,
        push: true,
        webhook: ''
      }
    }
  };
}

function generateDemoUsers(companyId: mongoose.Types.ObjectId) {
  const users = [
    {
      email: 'john.doe@wesalpulse-demo.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'agent' as const,
      department: 'Sales',
      status: 'active' as const,
      profile: {
        avatar: '',
        phone: '+1234567890',
        extension: '1001',
        location: 'New York',
        bio: 'Experienced sales agent'
      },
      preferences: {
        theme: 'system' as const,
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      company: companyId
    },
    {
      email: 'jane.smith@wesalpulse-demo.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'agent' as const,
      department: 'Support',
      status: 'active' as const,
      profile: {
        avatar: '',
        phone: '+1234567891',
        extension: '1002',
        location: 'Los Angeles',
        bio: 'Technical support specialist'
      },
      preferences: {
        theme: 'system' as const,
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      company: companyId
    },
    {
      email: 'mike.wilson@wesalpulse-demo.com',
      password: 'password123',
      firstName: 'Mike',
      lastName: 'Wilson',
      role: 'supervisor' as const,
      department: 'Support',
      status: 'active' as const,
      profile: {
        avatar: '',
        phone: '+1234567892',
        extension: '1003',
        location: 'Chicago',
        bio: 'Support team supervisor'
      },
      preferences: {
        theme: 'system' as const,
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      company: companyId
    },
    {
      email: 'sarah.brown@wesalpulse-demo.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Brown',
      role: 'agent' as const,
      department: 'Billing',
      status: 'inactive' as const,
      profile: {
        avatar: '',
        phone: '+1234567893',
        extension: '1004',
        location: 'Houston',
        bio: 'Billing support agent'
      },
      preferences: {
        theme: 'system' as const,
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      company: companyId
    },
    {
      email: 'david.jones@wesalpulse-demo.com',
      password: 'password123',
      firstName: 'David',
      lastName: 'Jones',
      role: 'agent' as const,
      department: 'Technical',
      status: 'active' as const,
      profile: {
        avatar: '',
        phone: '+1234567894',
        extension: '1005',
        location: 'Seattle',
        bio: 'Technical support agent'
      },
      preferences: {
        theme: 'system' as const,
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      company: companyId
    }
  ];
  return users;
}

function generateDemoQueues(companyId: mongoose.Types.ObjectId) {
  const queues = [
    {
      name: 'Sales Queue',
      description: 'Sales and customer acquisition calls',
      type: 'inbound' as const,
      status: 'active' as const,
      settings: {
        maxWaitTime: 300,
        serviceLevel: 85,
        overflow: {
          enabled: true,
          waitTime: 180
        },
        callback: {
          enabled: true,
          maxAttempts: 3,
          interval: 30
        },
        recording: {
          enabled: true,
          quality: 'medium' as const,
          retention: 90
        }
      },
      metrics: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        serviceLevel: 0,
        lastUpdated: new Date()
      },
      agents: [],
      company: companyId
    },
    {
      name: 'Support Queue',
      description: 'Technical support and customer service',
      type: 'inbound' as const,
      status: 'active' as const,
      settings: {
        maxWaitTime: 180,
        serviceLevel: 90,
        overflow: {
          enabled: false,
          waitTime: 120
        },
        callback: {
          enabled: true,
          maxAttempts: 2,
          interval: 45
        },
        recording: {
          enabled: true,
          quality: 'high' as const,
          retention: 120
        }
      },
      metrics: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        serviceLevel: 0,
        lastUpdated: new Date()
      },
      agents: [],
      company: companyId
    },
    {
      name: 'Billing Queue',
      description: 'Billing and payment related inquiries',
      type: 'inbound' as const,
      status: 'active' as const,
      settings: {
        maxWaitTime: 240,
        serviceLevel: 80,
        overflow: {
          enabled: false,
          waitTime: 180
        },
        callback: {
          enabled: false,
          maxAttempts: 1,
          interval: 60
        },
        recording: {
          enabled: true,
          quality: 'medium' as const,
          retention: 60
        }
      },
      metrics: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        serviceLevel: 0,
        lastUpdated: new Date()
      },
      agents: [],
      company: companyId
    },
    {
      name: 'Technical Queue',
      description: 'Advanced technical support',
      type: 'inbound' as const,
      status: 'active' as const,
      settings: {
        maxWaitTime: 360,
        serviceLevel: 75,
        overflow: {
          enabled: true,
          waitTime: 240
        },
        callback: {
          enabled: true,
          maxAttempts: 4,
          interval: 20
        },
        recording: {
          enabled: true,
          quality: 'high' as const,
          retention: 180
        }
      },
      metrics: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        serviceLevel: 0,
        lastUpdated: new Date()
      },
      agents: [],
      company: companyId
    },
    {
      name: 'Retention Queue',
      description: 'Customer retention and loyalty calls',
      type: 'blended' as const,
      status: 'active' as const,
      settings: {
        maxWaitTime: 120,
        serviceLevel: 95,
        overflow: {
          enabled: false,
          waitTime: 90
        },
        callback: {
          enabled: true,
          maxAttempts: 2,
          interval: 15
        },
        recording: {
          enabled: true,
          quality: 'high' as const,
          retention: 365
        }
      },
      metrics: {
        totalCalls: 0,
        answeredCalls: 0,
        abandonedCalls: 0,
        averageWaitTime: 0,
        averageHandleTime: 0,
        serviceLevel: 0,
        lastUpdated: new Date()
      },
      agents: [],
      company: companyId
    }
  ];
  return queues;
}

function generateDemoCalls(companyId: mongoose.Types.ObjectId, users: any[], queues: any[]) {
  const calls = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Generate calls for today
  for (let i = 0; i < 150; i++) {
    const startTime = new Date(today.getTime() + Math.random() * 8 * 60 * 60 * 1000); // Random time during work hours
    const isAnswered = Math.random() > 0.2; // 80% answer rate
    const isTransferred = Math.random() > 0.8; // 20% transfer rate
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomQueue = queues[Math.floor(Math.random() * queues.length)];
    
    const call = {
      callId: `CALL-${String(i + 1).padStart(6, '0')}`,
      direction: 'inbound' as const,
      status: isAnswered ? (Math.random() > 0.1 ? 'completed' : 'answered') : (Math.random() > 0.5 ? 'abandoned' : 'ringing'),
      customer: {
        name: `Customer ${i + 1}`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 100000000}`,
        email: `customer${i + 1}@example.com`,
        accountNumber: `ACC${String(i + 1).padStart(8, '0')}`
      },
      agent: randomUser._id,
      queue: randomQueue._id,
      company: companyId,
      timing: {
        startTime: startTime,
        answerTime: isAnswered ? new Date(startTime.getTime() + Math.random() * 60 * 1000) : undefined,
        endTime: isAnswered ? new Date(startTime.getTime() + Math.random() * 600 * 1000 + 60 * 1000) : undefined,
        waitTime: Math.floor(Math.random() * 120),
        handleTime: Math.floor(Math.random() * 480) + 60,
        talkTime: Math.floor(Math.random() * 360) + 30,
        holdTime: Math.floor(Math.random() * 60)
      },
      outcome: {
        resolved: Math.random() > 0.3,
        category: ['Sales', 'Support', 'Billing', 'Technical', 'Retention'][Math.floor(Math.random() * 5)],
        subcategory: ['General', 'Urgent', 'Complex', 'Simple'][Math.floor(Math.random() * 4)],
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        notes: `Call ${i + 1} notes`,
        tags: ['important', 'follow-up', 'resolved'].filter(() => Math.random() > 0.7)
      },
      metadata: {
        source: ['Web', 'Phone', 'Email', 'Chat'][Math.floor(Math.random() * 4)],
        campaign: Math.random() > 0.7 ? `Campaign ${Math.floor(Math.random() * 5) + 1}` : undefined,
        disposition: isAnswered ? 'Completed' : 'Missed',
        transferred: isTransferred,
        conference: Math.random() > 0.9,
        skills: ['sales', 'support', 'technical', 'billing'].filter(() => Math.random() > 0.6)
      }
    };
    
    calls.push(call);
  }
  
  return calls;
}

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await CallData.deleteMany({});
    await User.deleteMany({});
    await Queue.deleteMany({});
    await Company.deleteMany({});
    
    // Create company
    const companyData = generateDemoCompany();
    const company = new Company(companyData);
    await company.save();
    
    // Create users
    const usersData = generateDemoUsers(company._id);
    const users = await User.insertMany(usersData);
    
    // Create queues
    const queuesData = generateDemoQueues(company._id);
    const queues = await Queue.insertMany(queuesData);
    
    // Assign agents to queues (random assignment)
    for (const queue of queues) {
      const randomAgents = users.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * users.length) + 1);
      queue.agents = randomAgents.map(user => user._id);
      await queue.save();
    }
    
    // Create calls
    const callsData = generateDemoCalls(company._id, users, queues);
    await CallData.insertMany(callsData);
    
    return NextResponse.json({ 
      message: 'Demo data seeded successfully',
      stats: {
        companies: 1,
        users: users.length,
        queues: queues.length,
        calls: callsData.length
      }
    });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}