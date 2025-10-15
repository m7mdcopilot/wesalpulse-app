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
  const firstNames = [
    'John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma', 'James', 'Jennifer',
    'Michael', 'Emily', 'William', 'Olivia', 'Richard', 'Sophia', 'Joseph', 'Isabella', 'Thomas', 'Mia',
    'Charles', 'Charlotte', 'Christopher', 'Amelia', 'Daniel', 'Harper', 'Matthew', 'Evelyn', 'Anthony', 'Abigail',
    'Mark', 'Emily', 'Donald', 'Elizabeth', 'Steven', 'Sofia', 'Paul', 'Avery', 'Andrew', 'Ella',
    'Joshua', 'Scarlett', 'Kenneth', 'Grace', 'Kevin', 'Chloe', 'Brian', 'Victoria', 'George', 'Penelope',
    'Edward', 'Riley', 'Ronald', 'Aria', 'Timothy', 'Lily', 'Jason', 'Zoe', 'Jeffrey', 'Nora',
    'Ryan', 'Hannah', 'Jacob', 'Lillian', 'Gary', 'Addison', 'Nicholas', 'Eleanor', 'Eric', 'Stella',
    'Jonathan', 'Natalie', 'Stephen', 'Hazel', 'Larry', 'Violet', 'Justin', 'Aurora', 'Scott', 'Savannah',
    'Brandon', 'Audrey', 'Benjamin', 'Brooklyn', 'Gregory', 'Bella', 'Samuel', 'Claire', 'Patrick', 'Skylar',
    'Alexander', 'Lucy', 'Jack', 'Caroline', 'Dennis', 'Diana', 'Jerry', 'Paisley', 'Tyler', 'Genesis',
    'Henry', 'Leah', 'Peter', 'Annabelle', 'Douglas', 'Naomi', 'Raymond', 'Gabriella', 'Peter', 'Autumn'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner',
    'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers',
    'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox',
    'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly',
    'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry'
  ];
  
  const departments = [
    'Sales', 'Support', 'Billing', 'Technical', 'Retention', 'Customer Service', 'Help Desk',
    'Emergency', 'Complaints', 'Inquiries', 'Orders', 'Returns', 'Warranty', 'Installation',
    'Maintenance', 'Consultation', 'Booking', 'Reservations', 'Information', 'Feedback',
    'Escalation', 'VIP', 'International', 'Outbound', 'Training', 'Quality Assurance'
  ];
  
  const locations = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte',
    'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland',
    'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Mesa', 'Sacramento',
    'Atlanta', 'Kansas City', 'Colorado Springs', 'Omaha', 'Raleigh', 'Miami', 'Long Beach', 'Virginia Beach',
    'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans', 'Cleveland', 'Wichita', 'Bakersfield'
  ];
  
  const roles = ['agent', 'agent', 'agent', 'agent', 'supervisor', 'manager']; // Mostly agents, some supervisors/managers
  
  const users = [];
  
  for (let i = 0; i < 115; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = Math.random() > 0.15 ? 'active' as const : 'inactive' as const;
    
    const user = {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@wesalpulse-demo.com`,
      password: 'password123',
      firstName: firstName,
      lastName: lastName,
      role: role,
      department: department,
      status: status,
      profile: {
        avatar: '',
        phone: `+1${Math.floor(Math.random() * 9000000000) + 100000000}`,
        extension: `${1000 + i}`,
        location: location,
        bio: `${department} ${role} with ${Math.floor(Math.random() * 10) + 1} years of experience`
      },
      preferences: {
        theme: ['system', 'light', 'dark'][Math.floor(Math.random() * 3)] as 'system' | 'light' | 'dark',
        language: 'en',
        notifications: {
          email: Math.random() > 0.2,
          sms: Math.random() > 0.5,
          push: Math.random() > 0.3
        }
      },
      company: companyId
    };
    
    users.push(user);
  }
  
  return users;
}

function generateDemoQueues(companyId: mongoose.Types.ObjectId) {
  const queueTypes = [
    'Sales', 'Support', 'Billing', 'Technical', 'Retention', 'Customer Service', 'Help Desk',
    'Emergency', 'Complaints', 'Inquiries', 'Orders', 'Returns', 'Warranty', 'Installation',
    'Maintenance', 'Consultation', 'Booking', 'Reservations', 'Information', 'Feedback',
    'Escalation', 'VIP', 'International', 'Outbound', 'Training', 'Quality Assurance'
  ];
  
  const queues = queueTypes.map((type, index) => {
    const baseSettings = {
      maxWaitTime: 120 + Math.floor(Math.random() * 240), // 120-360 seconds
      serviceLevel: 75 + Math.floor(Math.random() * 20), // 75-95%
      overflow: {
        enabled: Math.random() > 0.5,
        waitTime: 120 + Math.floor(Math.random() * 120)
      },
      callback: {
        enabled: Math.random() > 0.3,
        maxAttempts: 1 + Math.floor(Math.random() * 4),
        interval: 15 + Math.floor(Math.random() * 45)
      },
      recording: {
        enabled: true,
        quality: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        retention: 30 + Math.floor(Math.random() * 330)
      }
    };
    
    return {
      name: `${type} Queue`,
      description: `${type} related calls and inquiries`,
      type: Math.random() > 0.8 ? 'blended' : 'inbound' as const,
      status: Math.random() > 0.1 ? 'active' as const : 'inactive' as const,
      settings: baseSettings,
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
    };
  });
  
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