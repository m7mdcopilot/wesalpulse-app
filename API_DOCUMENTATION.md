# Dashboard API Documentation

## Overview

The WesalPulse Dashboard API provides a comprehensive data structure for call center analytics, real-time metrics, and company management. The API is designed to support modern dashboard applications with real-time updates and detailed analytics.

## API Endpoints

### 1. Main Dashboard API
**Endpoint:** `/api/dashboard`  
**Method:** `GET`  
**Description:** Returns comprehensive dashboard data structure

**Response Structure:**
```typescript
{
  company: {
    name: string
    queues: Array<Queue>
    settings: {
      generalSettings: GeneralSettings
      usersManagement: UsersManagement
      notifications: Notifications
    }
  }
  userProfile: UserProfile
  dataView: DataView
  analytics: Analytics
  metadata: Metadata
}
```

### 2. Real-time Data API
**Endpoint:** `/api/realtime`  
**Method:** `GET`  
**Description:** Returns real-time data with live updates

**Query Parameters:**
- `type` (optional): Filter data type (`all`, `currentCallStatus`, `callOutcomes`, `callHandlingMetrics`, `queues`, `agents`)

**Response Structure:**
```typescript
{
  timestamp: string
  data: {
    currentCallStatus: CurrentCallStatus
    callOutcomes: CallOutcomes
    callHandlingMetrics: CallHandlingMetrics
    queues: Array<RealtimeQueue>
    agents: Array<RealtimeAgent>
  }
}
```

### 3. Analytics API
**Endpoint:** `/api/analytics`  
**Method:** `GET`  
**Description:** Returns detailed analytics with trends and insights

**Query Parameters:**
- `category` (optional): Filter by category (`all`, `callCenterStatusToday`, `callCenterPerformance`, `queuePerformance`, `agentPerformance`)
- `timeRange` (optional): Time range filter (`today`, `last7days`, `last30days`)

**Response Structure:**
```typescript
{
  timestamp: string
  timeRange: string
  category: string
  data: {
    callCenterStatusToday: CallCenterStatusToday
    callCenterPerformance: CallCenterPerformanceAnalytics
    queuePerformance: QueuePerformanceAnalytics
    agentPerformance: AgentPerformanceAnalytics
  }
}
```

## Data Structures

### Company Data
```typescript
interface Company {
  name: string
  queues: Array<{
    id: string
    name: string
    status: string
    agents: number
    waitingCalls: number
    longestWait: string
    serviceLevel: string
  }>
  settings: {
    generalSettings: {
      integrationEnabled: boolean
      genesysEnvironment: string
      lastUpdated: string
    }
    usersManagement: {
      totalUsers: number
      activeUsers: number
      roles: string[]
      lastUpdated: string
    }
    notifications: {
      emailAlerts: boolean
      smsAlerts: boolean
      inAppNotifications: boolean
      lastUpdated: string
    }
  }
}
```

### User Profile
```typescript
interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  lastLogin: string
  permissions: string[]
  preferences: {
    theme: string
    language: string
    timezone: string
    notifications: {
      email: boolean
      sms: boolean
      desktop: boolean
    }
  }
}
```

### DataView - Call Center Status Today
```typescript
interface CallCenterStatusToday {
  currentCallStatus: {
    activeCalls: number
    totalAgents: number
    availableAgents: number
    onBreakAgents: number
    inTrainingAgents: number
    utilizationRate: string
    lastUpdated: string
  }
  callOutcomes: {
    answered: number
    abandoned: number
    transferred: number
    voicemail: number
    total: number
    answerRate: string
    lastUpdated: string
  }
  callHandlingMetrics: {
    averageHandleTime: string
    averageTalkTime: string
    averageWrapUpTime: string
    serviceLevel: string
    firstCallResolution: string
    lastUpdated: string
  }
}
```

### DataView - Performance Metrics
```typescript
interface CallCenterPerformance {
  overview: {
    totalCalls: number
    answeredCalls: number
    abandonedCalls: number
    serviceLevel: string
    averageWaitTime: string
    lastUpdated: string
  }
  metrics: Array<{
    name: string
    value: string
    trend: string
    change: string
  }>
}
```

### Analytics - Enhanced Metrics
```typescript
interface AnalyticsData {
  callCenterStatusToday: {
    currentCallStatus: { /* ... */ }
    callOutcomes: { /* ... */ }
    callHandlingMetrics: { /* ... */ }
    trends: {
      hourlyData: Array<{
        hour: number
        calls: number
        serviceLevel: number
        averageWaitTime: number
      }>
    }
  }
  callCenterPerformance: {
    overview: { /* ... */ }
    metrics: Array<{
      name: string
      value: string
      target: string
      trend: string
      change: string
      status: string
    }>
    performanceByHour: Array<{ /* ... */ }>
  }
  queuePerformance: {
    overview: { /* ... */ }
    queueDetails: Array<{ /* ... */ }>
    efficiencyMetrics: Array<{
      metric: string
      current: string
      target: string
      status: string
      trend: string
    }>
  }
  agentPerformance: {
    overview: { /* ... */ }
    topPerformers: Array<{ /* ... */ }>
    performanceMetrics: Array<{ /* ... */ }>
    teamComparison: Array<{ /* ... */ }>
  }
}
```

## Usage Examples

### Basic API Call
```javascript
// Fetch main dashboard data
const response = await fetch('/api/dashboard');
const dashboardData = await response.json();

console.log(dashboardData.company.name);
console.log(dashboardData.dataView.callCenterStatusToday.currentCallStatus);
```

### Real-time Updates
```javascript
// Fetch real-time data
const response = await fetch('/api/realtime?type=currentCallStatus');
const realtimeData = await response.json();

console.log(realtimeData.data.currentCallStatus.activeCalls);
console.log(realtimeData.data.currentCallStatus.utilizationRate);
```

### Analytics with Filters
```javascript
// Fetch analytics for specific category
const response = await fetch('/api/analytics?category=callCenterPerformance&timeRange=today');
const analyticsData = await response.json();

console.log(analyticsData.data.callCenterPerformance.metrics);
```

### Using React Hooks
```typescript
import { useDashboardData, useRealtimeData, useAnalyticsData } from '@/lib/api';

function DashboardComponent() {
  const { data: dashboardData, loading, error } = useDashboardData();
  const { data: realtimeData } = useRealtimeData('currentCallStatus', 5000);
  const { data: analyticsData } = useAnalyticsData('callCenterPerformance', 'today');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{dashboardData.company.name}</h1>
      <div>Active Calls: {realtimeData.data.currentCallStatus.activeCalls}</div>
      <div>Service Level: {analyticsData.data.callCenterPerformance.overview.serviceLevel}</div>
    </div>
  );
}
```

## Real-time Updates

The API supports real-time updates through:

1. **Polling**: Use the `/api/realtime` endpoint with regular intervals
2. **WebSocket**: Connect through `/api/socketio` for live updates
3. **React Hooks**: Use the provided hooks for automatic data fetching

### WebSocket Connection
```javascript
const ws = new WebSocket('/api/socketio');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
  console.log('Real-time update:', data);
};
```

## Error Handling

All API endpoints return proper HTTP status codes and error messages:

```javascript
try {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error);
  // Handle error
}
```

## Data Freshness

- **Dashboard API**: Cached data, updates every 30 seconds
- **Realtime API**: Live data, updates every 5 seconds by default
- **Analytics API**: Historical data with trends, updates every hour

## Integration Guide

### For Frontend Applications
1. Use the provided React hooks for easy integration
2. Implement proper loading states and error handling
3. Use the TypeScript interfaces for type safety
4. Implement real-time updates with WebSocket or polling

### For Mobile Applications
1. Use the same API endpoints
2. Implement offline caching for better performance
3. Use WebSocket for real-time updates
4. Handle network interruptions gracefully

### For Third-party Integrations
1. Use API keys for authentication (to be implemented)
2. Respect rate limits (to be implemented)
3. Use webhooks for real-time notifications (to be implemented)

## Example Implementation

Visit `/api-example` to see a complete implementation example demonstrating:
- Company data display
- User profile management
- Real-time metrics
- Analytics with trends
- Proper error handling
- Responsive design

## Future Enhancements

- [ ] Authentication and authorization
- [ ] Rate limiting and API keys
- [ ] Webhook support
- [ ] Data export functionality
- [ ] Custom dashboard configurations
- [ ] Advanced filtering and search
- [ ] Historical data analysis
- [ ] Performance optimizations