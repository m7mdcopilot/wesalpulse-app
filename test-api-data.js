const fetch = require('node-fetch');

async function testAPIData() {
  try {
    console.log('🔄 Testing API data...');
    const response = await fetch('http://localhost:3000/api/agent-performance');
    
    if (!response.ok) {
      console.error(`❌ API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API response received');
    
    if (!data.agentPerformance) {
      console.error('❌ No agentPerformance data in response');
      return;
    }
    
    console.log('📊 Agent Performance Overview:');
    console.log(`  Total Agents: ${data.agentPerformance.overview.totalAgents}`);
    console.log(`  Total Calls: ${data.agentPerformance.overview.totalCalls}`);
    console.log(`  Average Handle Time: ${data.agentPerformance.overview.averageHandleTime}`);
    console.log(`  Average Satisfaction: ${data.agentPerformance.overview.averageSatisfaction}`);
    
    console.log('\n👥 Agent Data:');
    data.agentPerformance.agents.forEach((agent, index) => {
      console.log(`\n  Agent ${index + 1}:`);
      console.log(`    Name: ${agent.name}`);
      console.log(`    Total Calls: ${agent.totalCalls}`);
      console.log(`    Answered Calls: ${agent.answeredCalls}`);
      console.log(`    Satisfaction: ${agent.satisfaction}`);
      console.log(`    Quality Score: ${agent.qualityScore}`);
      console.log(`    Adherence: ${agent.adherence}`);
      console.log(`    Status: ${agent.status}`);
    });
    
    // Test the data processing logic
    console.log('\n🔄 Testing data processing logic...');
    
    // Performance trends calculation
    const totalCalls = data.agentPerformance.agents.reduce((sum, agent) => sum + agent.totalCalls, 0);
    console.log(`\n📈 Performance Trends Calculation:`);
    console.log(`  Total Calls: ${totalCalls}`);
    
    const trends = [
      { hour: '00:00', calls: Math.floor(totalCalls * 0.05), satisfaction: 4.2, quality: 85 },
      { hour: '04:00', calls: Math.floor(totalCalls * 0.03), satisfaction: 4.0, quality: 82 },
      { hour: '08:00', calls: Math.floor(totalCalls * 0.25), satisfaction: 4.5, quality: 88 },
      { hour: '12:00', calls: Math.floor(totalCalls * 0.45), satisfaction: 4.3, quality: 86 },
      { hour: '16:00', calls: Math.floor(totalCalls * 0.35), satisfaction: 4.1, quality: 84 },
      { hour: '20:00', calls: Math.floor(totalCalls * 0.15), satisfaction: 4.4, quality: 87 },
      { hour: '24:00', calls: Math.floor(totalCalls * 0.08), satisfaction: 4.2, quality: 83 }
    ];
    
    console.log('  Generated Trends Data:');
    trends.forEach(trend => {
      console.log(`    ${trend.hour}: ${trend.calls} calls`);
    });
    
    // Satisfaction distribution calculation
    const satisfactionScores = data.agentPerformance.agents.map(agent => parseFloat(agent.satisfaction)).filter(score => !isNaN(score));
    console.log(`\n⭐ Satisfaction Distribution Calculation:`);
    console.log(`  Satisfaction Scores: ${satisfactionScores.join(', ')}`);
    
    const excellentCount = satisfactionScores.filter(score => score >= 4.5).length;
    const veryGoodCount = satisfactionScores.filter(score => score >= 3.5 && score < 4.5).length;
    const goodCount = satisfactionScores.filter(score => score >= 2.5 && score < 3.5).length;
    const poorCount = satisfactionScores.filter(score => score >= 1.5 && score < 2.5).length;
    const veryPoorCount = satisfactionScores.filter(score => score < 1.5).length;
    
    console.log(`  Excellent Count: ${excellentCount}`);
    console.log(`  Very Good Count: ${veryGoodCount}`);
    console.log(`  Good Count: ${goodCount}`);
    console.log(`  Poor Count: ${poorCount}`);
    console.log(`  Very Poor Count: ${veryPoorCount}`);
    
    const satisfactionDist = [
      { name: 'Excellent (5)', value: excellentCount || 35, color: '#22c55e' },
      { name: 'Very Good (4)', value: veryGoodCount || 28, color: '#3b82f6' },
      { name: 'Good (3)', value: goodCount || 22, color: '#f59e0b' },
      { name: 'Poor (2)', value: poorCount || 10, color: '#ef4444' },
      { name: 'Very Poor (1)', value: veryPoorCount || 5, color: '#dc2626' }
    ];
    
    console.log('  Generated Satisfaction Distribution:');
    satisfactionDist.forEach(dist => {
      console.log(`    ${dist.name}: ${dist.value}`);
    });
    
    // Quality trends calculation
    const avgQualityScore = data.agentPerformance.agents.reduce((sum, agent) => sum + agent.qualityScore, 0) / data.agentPerformance.agents.length;
    console.log(`\n🎯 Quality Trends Calculation:`);
    console.log(`  Average Quality Score: ${avgQualityScore.toFixed(2)}`);
    
    const qualityTrends = [
      { day: 'Mon', quality: Math.round(avgQualityScore * 0.95), target: 90 },
      { day: 'Tue', quality: Math.round(avgQualityScore * 0.97), target: 90 },
      { day: 'Wed', quality: Math.round(avgQualityScore * 0.93), target: 90 },
      { day: 'Thu', quality: Math.round(avgQualityScore * 0.99), target: 90 },
      { day: 'Fri', quality: Math.round(avgQualityScore * 1.01), target: 90 },
      { day: 'Sat', quality: Math.round(avgQualityScore * 0.96), target: 90 },
      { day: 'Sun', quality: Math.round(avgQualityScore * 0.94), target: 90 }
    ];
    
    console.log('  Generated Quality Trends:');
    qualityTrends.forEach(trend => {
      console.log(`    ${trend.day}: ${trend.quality} (target: ${trend.target})`);
    });
    
    // Adherence calculation
    const adherenceScores = data.agentPerformance.agents.map(agent => parseInt(agent.adherence)).filter(score => !isNaN(score));
    console.log(`\n📊 Adherence Calculation:`);
    console.log(`  Adherence Scores: ${adherenceScores.join(', ')}`);
    
    const above95Count = adherenceScores.filter(score => score >= 95).length;
    const above90Count = adherenceScores.filter(score => score >= 90 && score < 95).length;
    const above85Count = adherenceScores.filter(score => score >= 85 && score < 90).length;
    const below85Count = adherenceScores.filter(score => score < 85).length;
    
    console.log(`  Above 95%: ${above95Count}`);
    console.log(`  90-95%: ${above90Count}`);
    console.log(`  85-90%: ${above85Count}`);
    console.log(`  Below 85%: ${below85Count}`);
    
    const adherenceDist = [
      { name: 'Above 95%', value: above95Count || 45, color: '#22c55e' },
      { name: '90-95%', value: above90Count || 30, color: '#3b82f6' },
      { name: '85-90%', value: above85Count || 15, color: '#f59e0b' },
      { name: 'Below 85%', value: below85Count || 10, color: '#ef4444' }
    ];
    
    console.log('  Generated Adherence Distribution:');
    adherenceDist.forEach(dist => {
      console.log(`    ${dist.name}: ${dist.value}`);
    });
    
    console.log('\n✅ All data processing tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing API data:', error);
  }
}

testAPIData();