const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse?retryWrites=true&w=majority';

// Sample data generator
function generateSampleCallData(companyId, agentIds, queueIds) {
  const sampleCalls = [];
  const statuses = ['answered', 'completed', 'abandoned', 'failed'];
  const directions = ['inbound', 'outbound'];
  const categories = ['Technical Support', 'Billing', 'Sales', 'Customer Service', 'Complaint'];
  const dispositions = ['Resolved', 'Escalated', 'Transferred', 'Callback', 'Cancelled'];
  const skills = ['Technical', 'Billing', 'Sales', 'Customer Service', 'Complaint Handling'];
  
  // Generate calls for the last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 200; i++) {
    const startTime = new Date(sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime()));
    const isAnswered = Math.random() > 0.2; // 80% answered rate
    const status = isAnswered ? (Math.random() > 0.5 ? 'answered' : 'completed') : (Math.random() > 0.5 ? 'abandoned' : 'failed');
    
    const call = {
      callId: `CALL-${Date.now()}-${i}`,
      direction: directions[Math.floor(Math.random() * directions.length)],
      status: status,
      customer: {
        name: `Customer ${i + 1}`,
        phone: `+1${Math.floor(Math.random() * 10000000000)}`,
        email: `customer${i + 1}@example.com`,
        accountNumber: `ACC${Math.floor(Math.random() * 10000)}`
      },
      agent: agentIds[Math.floor(Math.random() * agentIds.length)],
      queue: queueIds[Math.floor(Math.random() * queueIds.length)],
      company: companyId,
      timing: {
        startTime: startTime,
        waitTime: Math.floor(Math.random() * 120), // 0-2 minutes
        handleTime: Math.floor(Math.random() * 600) + 60, // 1-11 minutes
        talkTime: Math.floor(Math.random() * 480) + 30, // 30 seconds - 8.5 minutes
        holdTime: Math.floor(Math.random() * 120) // 0-2 minutes
      },
      outcome: {
        resolved: isAnswered && Math.random() > 0.3,
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        notes: `Sample call notes for call ${i + 1}`,
        tags: ['sample', 'test', categories[Math.floor(Math.random() * categories.length)]]
      },
      quality: {
        satisfaction: isAnswered ? Math.floor(Math.random() * 5) + 1 : undefined, // 1-5 scale
        qualityScore: isAnswered ? Math.floor(Math.random() * 40) + 60 : undefined, // 60-100 scale
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
      },
      metadata: {
        source: 'Web',
        disposition: dispositions[Math.floor(Math.random() * dispositions.length)],
        transferred: Math.random() > 0.8,
        conference: Math.random() > 0.9,
        skills: [skills[Math.floor(Math.random() * skills.length)]]
      }
    };
    
    // Set answerTime and endTime for answered calls
    if (isAnswered) {
      call.timing.answerTime = new Date(startTime.getTime() + call.timing.waitTime * 1000);
      call.timing.endTime = new Date(call.timing.answerTime.getTime() + call.timing.handleTime * 1000);
    }
    
    sampleCalls.push(call);
  }
  
  return sampleCalls;
}

async function populateSampleData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    const db = mongoose.connection.db;
    
    // Get existing data
    const companies = await db.collection('companies').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    const queues = await db.collection('queues').find({}).toArray();
    
    console.log(`📋 Found ${companies.length} companies, ${users.length} users, ${queues.length} queues`);
    
    if (companies.length === 0) {
      console.log('❌ No companies found. Please create a company first.');
      return;
    }
    
    if (users.length === 0) {
      console.log('❌ No users found. Please create users first.');
      return;
    }
    
    if (queues.length === 0) {
      console.log('❌ No queues found. Please create queues first.');
      return;
    }
    
    const companyId = companies[0]._id;
    const agentIds = users.map(u => u._id);
    const queueIds = queues.map(q => q._id);
    
    console.log(`🎯 Using company: ${companies[0].name}`);
    console.log(`👥 Using ${agentIds.length} agents`);
    console.log(`📞 Using ${queueIds.length} queues`);
    
    // Generate sample call data
    console.log('📊 Generating sample call data...');
    const sampleCalls = generateSampleCallData(companyId, agentIds, queueIds);
    
    // Insert sample calls
    console.log(`💾 Inserting ${sampleCalls.length} sample calls...`);
    const result = await db.collection('calldatas').insertMany(sampleCalls);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} sample calls`);
    
    // Verify the data
    const callCount = await db.collection('calldatas').countDocuments({});
    console.log(`📊 Total calls in database: ${callCount}`);
    
    // Show some sample data
    const sampleCall = await db.collection('calldatas').findOne({});
    if (sampleCall) {
      console.log('📋 Sample call data:');
      console.log(`  Call ID: ${sampleCall.callId}`);
      console.log(`  Status: ${sampleCall.status}`);
      console.log(`  Direction: ${sampleCall.direction}`);
      console.log(`  Customer: ${sampleCall.customer.name}`);
      console.log(`  Handle Time: ${sampleCall.timing.handleTime}s`);
      console.log(`  Satisfaction: ${sampleCall.quality.satisfaction}`);
      console.log(`  Quality Score: ${sampleCall.quality.qualityScore}`);
    }
    
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

populateSampleData();