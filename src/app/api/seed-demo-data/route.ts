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
  
  // Generate calls for the last 7 days to create more realistic data
  for (let day = 6; day >= 0; day--) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - day);
    targetDate.setHours(0, 0, 0, 0);
    
    // Generate more calls per day (increased from 150 to 300 calls per day)
    const callsPerDay = day === 0 ? 350 : 300; // More calls for today
    
    for (let i = 0; i < callsPerDay; i++) {
      // Generate calls during work hours (9 AM - 6 PM)
      const startHour = 9 + Math.floor(Math.random() * 9); // 9 AM to 6 PM
      const startMinute = Math.floor(Math.random() * 60);
      const startTime = new Date(targetDate);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const isAnswered = Math.random() > 0.15; // 85% answer rate (slightly better)
      const isTransferred = Math.random() > 0.75; // 25% transfer rate
      
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomQueue = queues[Math.floor(Math.random() * queues.length)];
      
      const call = {
        callId: `CALL-${String(calls.length + 1).padStart(6, '0')}`,
        direction: 'inbound' as const,
        status: isAnswered ? (Math.random() > 0.1 ? 'completed' : 'answered') : (Math.random() > 0.5 ? 'abandoned' : 'ringing'),
        customer: {
          name: `Customer ${calls.length + 1}`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 100000000}`,
          email: `customer${calls.length + 1}@example.com`,
          accountNumber: `ACC${String(calls.length + 1).padStart(8, '0')}`
        },
        agent: randomUser._id,
        queue: randomQueue._id,
        company: companyId,
        timing: {
          startTime: startTime,
          answerTime: isAnswered ? new Date(startTime.getTime() + Math.random() * 90 * 1000) : undefined,
          endTime: isAnswered ? new Date(startTime.getTime() + Math.random() * 720 * 1000 + 90 * 1000) : undefined,
          waitTime: Math.floor(Math.random() * 180), // Increased wait time range
          handleTime: Math.floor(Math.random() * 600) + 90, // Increased handle time
          talkTime: Math.floor(Math.random() * 480) + 60,
          holdTime: Math.floor(Math.random() * 120) // Increased hold time
        },
        outcome: {
          resolved: Math.random() > 0.25, // Slightly better resolution rate
          category: ['Sales', 'Support', 'Billing', 'Technical', 'Retention'][Math.floor(Math.random() * 5)],
          subcategory: ['General', 'Urgent', 'Complex', 'Simple'][Math.floor(Math.random() * 4)],
          priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
          notes: `Call ${calls.length + 1} notes - ${day === 0 ? 'Today' : `${day} days ago`}`,
          tags: ['important', 'follow-up', 'resolved', 'escalated'].filter(() => Math.random() > 0.6)
        },
        quality: isAnswered ? {
          satisfaction: Math.random() * 2 + 3, // Satisfaction score 3-5
          qualityScore: Math.floor(Math.random() * 5) + 6, // Quality score 6-10
          notes: `Quality assessment for call ${calls.length + 1}`,
          agentRating: Math.floor(Math.random() * 3) + 3, // Agent rating 3-5
          customerFeedback: Math.random() > 0.3 ? 'Positive' : 'Neutral'
        } : undefined,
        metadata: {
          source: ['Web', 'Phone', 'Email', 'Chat', 'Social Media'][Math.floor(Math.random() * 5)],
          campaign: Math.random() > 0.6 ? `Campaign ${Math.floor(Math.random() * 8) + 1}` : undefined,
          disposition: isAnswered ? 'Completed' : 'Missed',
          transferred: isTransferred,
          conference: Math.random() > 0.85,
          skills: ['sales', 'support', 'technical', 'billing', 'retention'].filter(() => Math.random() > 0.5)
        }
      };
      
      calls.push(call);
    }
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