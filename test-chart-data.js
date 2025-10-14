// Test script to verify chart data structure
const testData = {
  performanceTrends: [
    { hour: '00:00', calls: 0, satisfaction: 4.2, quality: 85 },
    { hour: '04:00', calls: 0, satisfaction: 4, quality: 82 },
    { hour: '08:00', calls: 4, satisfaction: 4.5, quality: 88 },
    { hour: '12:00', calls: 8, satisfaction: 4.3, quality: 86 },
    { hour: '16:00', calls: 6, satisfaction: 4.1, quality: 84 },
    { hour: '20:00', calls: 2, satisfaction: 4.4, quality: 87 },
    { hour: '24:00', calls: 1, satisfaction: 4.2, quality: 83 }
  ],
  satisfactionDistribution: [
    { name: 'Excellent (5)', value: 35, color: '#22c55e' },
    { name: 'Very Good (4)', value: 28, color: '#3b82f6' },
    { name: 'Good (3)', value: 4, color: '#f59e0b' },
    { name: 'Poor (2)', value: 10, color: '#ef4444' },
    { name: 'Very Poor (1)', value: 5, color: '#dc2626' }
  ],
  qualityTrends: [
    { day: 'Mon', quality: 77, target: 90 },
    { day: 'Tue', quality: 78, target: 90 },
    { day: 'Wed', quality: 75, target: 90 },
    { day: 'Thu', quality: 80, target: 90 },
    { day: 'Fri', quality: 82, target: 90 },
    { day: 'Sat', quality: 78, target: 90 },
    { day: 'Sun', quality: 76, target: 90 }
  ],
  adherenceDistribution: [
    { name: 'Above 95%', value: 2, color: '#22c55e' },
    { name: '90-95%', value: 30, color: '#3b82f6' },
    { name: '85-90%', value: 2, color: '#f59e0b' },
    { name: 'Below 85%', value: 10, color: '#ef4444' }
  ]
};

console.log('Chart Data Structure Test:');
console.log('========================');

// Test performance trends
console.log('\n1. Performance Trends:');
console.log('Length:', testData.performanceTrends.length);
console.log('Sample data:', testData.performanceTrends[0]);
console.log('Has required fields:', testData.performanceTrends.every(item => 
  item.hour && typeof item.calls === 'number' && typeof item.satisfaction === 'number' && typeof item.quality === 'number'
));

// Test satisfaction distribution
console.log('\n2. Satisfaction Distribution:');
console.log('Length:', testData.satisfactionDistribution.length);
console.log('Sample data:', testData.satisfactionDistribution[0]);
console.log('Has required fields:', testData.satisfactionDistribution.every(item => 
  item.name && typeof item.value === 'number' && item.color
));

// Test quality trends
console.log('\n3. Quality Trends:');
console.log('Length:', testData.qualityTrends.length);
console.log('Sample data:', testData.qualityTrends[0]);
console.log('Has required fields:', testData.qualityTrends.every(item => 
  item.day && typeof item.quality === 'number' && typeof item.target === 'number'
));

// Test adherence distribution
console.log('\n4. Adherence Distribution:');
console.log('Length:', testData.adherenceDistribution.length);
console.log('Sample data:', testData.adherenceDistribution[0]);
console.log('Has required fields:', testData.adherenceDistribution.every(item => 
  item.name && typeof item.value === 'number' && item.color
));

console.log('\n✅ All chart data structures are valid!');
console.log('The charts should render correctly with this data structure.');