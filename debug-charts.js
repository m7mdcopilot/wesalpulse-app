// Debug script to check chart rendering logic
console.log('=== Chart Rendering Debug ===');

// Simulate the component state
const state = {
  loading: false,
  agentMetrics: [
    { agentId: '1', agentName: 'John Smith', totalCalls: 45, answeredCalls: 42, averageHandleTime: '3:45', averageTalkTime: '2:30', averageWrapTime: '1:15', satisfaction: '4.2', qualityScore: 87, adherence: '96%', status: 'excellent' }
  ],
  performanceTrends: [
    { hour: '00:00', calls: 5, satisfaction: 4.2, quality: 85 },
    { hour: '04:00', calls: 3, satisfaction: 4.0, quality: 82 },
    { hour: '08:00', calls: 25, satisfaction: 4.5, quality: 88 }
  ],
  satisfactionData: [
    { name: 'Excellent (5)', value: 35, color: '#22c55e' },
    { name: 'Very Good (4)', value: 28, color: '#3b82f6' }
  ],
  qualityData: [
    { day: 'Mon', quality: 85, target: 90 },
    { day: 'Tue', quality: 87, target: 90 }
  ],
  adherenceData: [
    { name: 'Above 95%', value: 45, color: '#22c55e' },
    { name: '90-95%', value: 30, color: '#3b82f6' }
  ]
};

// Check loading condition
const shouldShowPageLoading = state.loading && !state.agentMetrics.length;
console.log('Should show PageLoading:', shouldShowPageLoading);
console.log('Loading state:', state.loading);
console.log('Agent metrics length:', state.agentMetrics.length);

// Check chart data conditions
const chartConditions = {
  performanceTrends: state.performanceTrends.length > 0,
  satisfactionData: state.satisfactionData.length > 0,
  qualityData: state.qualityData.length > 0,
  adherenceData: state.adherenceData.length > 0
};

console.log('\nChart data conditions:');
Object.entries(chartConditions).forEach(([chart, condition]) => {
  console.log(`${chart}: ${condition ? '✅ Will render' : '❌ Will show loading'}`);
});

// Check widget order
const widgetOrder = ['performance-overview', 'satisfaction-analysis', 'quality-trends', 'adherence-metrics'];
console.log('\nWidget order:', widgetOrder);

console.log('\n=== Conclusion ===');
if (!shouldShowPageLoading) {
  console.log('✅ Page should render normally');
  console.log('✅ Charts should be visible with data');
} else {
  console.log('❌ Page will show loading spinner');
  console.log('❌ Charts will not be visible');
}