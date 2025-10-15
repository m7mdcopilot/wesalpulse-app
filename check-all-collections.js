const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse?retryWrites=true&w=majority';

async function checkAllCollections() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach((collection, index) => {
      console.log(`  ${index + 1}. ${collection.name}`);
    });
    
    // Check each collection for data
    for (const collection of collections) {
      const coll = db.collection(collection.name);
      const count = await coll.countDocuments({});
      console.log(`\n📊 Collection "${collection.name}": ${count} documents`);
      
      if (count > 0 && count <= 5) {
        const docs = await coll.find({}).limit(3).toArray();
        docs.forEach((doc, index) => {
          console.log(`  ${index + 1}. ID: ${doc._id}`);
          if (doc.companyId) {
            console.log(`     Company ID: ${doc.companyId}`);
          }
          if (doc.period) {
            console.log(`     Period: ${doc.period}`);
          }
          if (doc.analysisType) {
            console.log(`     Analysis Type: ${doc.analysisType}`);
          }
          if (doc.viewType) {
            console.log(`     View Type: ${doc.viewType}`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking collections:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkAllCollections();