const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse?retryWrites=true&w=majority';

async function checkDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    // Check collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Check companies
    const companiesCollection = db.collection('companies');
    const companies = await companiesCollection.find({}).toArray();
    console.log(`🏢 Found ${companies.length} companies:`);
    companies.forEach((company, index) => {
      console.log(`  ${index + 1}. ID: ${company._id}, Name: ${company.name}`);
    });
    
    // Check dashboards_data
    const dashboardsCollection = db.collection('dashboards_data');
    const dashboards = await dashboardsCollection.find({}).toArray();
    console.log(`📊 Found ${dashboards.length} dashboards_data records:`);
    dashboards.forEach((dashboard, index) => {
      console.log(`  ${index + 1}. Company ID: ${dashboard.companyId}, Period: ${dashboard.period}, Refresh Date: ${dashboard.refreshDate}`);
    });
    
    // Check analyses_data
    const analysesCollection = db.collection('analyses_data');
    const analyses = await analysesCollection.find({}).toArray();
    console.log(`📈 Found ${analyses.length} analyses_data records:`);
    analyses.forEach((analysis, index) => {
      console.log(`  ${index + 1}. Company ID: ${analysis.companyId}, Type: ${analysis.analysisType}, Period: ${analysis.period}`);
    });
    
    // Check dataview_data
    const dataviewCollection = db.collection('dataview_data');
    const dataviews = await dataviewCollection.find({}).toArray();
    console.log(`📋 Found ${dataviews.length} dataview_data records:`);
    dataviews.forEach((dataview, index) => {
      console.log(`  ${index + 1}. Company ID: ${dataview.companyId}, Type: ${dataview.viewType}`);
    });
    
    if (companies.length > 0 && dashboards.length > 0) {
      const firstCompany = companies[0];
      const firstDashboard = dashboards[0];
      console.log(`\n🔍 Matching check:`);
      console.log(`  First Company ID: ${firstCompany._id}`);
      console.log(`  First Dashboard Company ID: ${firstDashboard.companyId}`);
      console.log(`  IDs match: ${firstCompany._id.toString() === firstDashboard.companyId.toString()}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkDatabase();