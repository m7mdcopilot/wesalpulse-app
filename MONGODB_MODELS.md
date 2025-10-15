# WesalPulse MongoDB Models Documentation

## Overview

This document describes the MongoDB models and database structure for the WesalPulse call center dashboard application. The application now uses **MongoDB exclusively** as its database, with Mongoose as the ODM (Object Document Mapper). All Prisma-related code has been removed and replaced with MongoDB-native implementations.

## Database Migration

This application has been migrated from Prisma + SQLite to MongoDB + Mongoose:

- **Previous**: Prisma ORM with SQLite database
- **Current**: Mongoose ODM with MongoDB database
- **Benefits**: Better scalability, flexible schema, real-time capabilities, and cloud-native architecture

## MongoDB Connection

The application connects to MongoDB using the following configuration:

```typescript
// Connection URI from environment variables
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse'
```

### Environment Variables

```bash
MONGODB_URI=mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse
```

## Models Structure

### 1. Company Model (`Company`)

Represents a company/organization using the WesalPulse system.

```typescript
interface ICompany {
  name: string;
  domain: string;
  settings: {
    general: {
      timezone: string;
      businessHours: {
        start: string;
        end: string;
        days: number[];
      };
      language: string;
      currency: string;
    };
    users: {
      maxUsers: number;
      defaultRole: string;
      requireTwoFactor: boolean;
    };
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      webhook: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Features:**
- Company profile and domain management
- Configurable business hours and timezone
- User management settings
- Notification preferences
- Automatic timestamps

### 2. User Model (`User`)

Represents individual users within a company.

```typescript
interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'supervisor' | 'agent';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  profile: {
    avatar: string;
    phone: string;
    extension: string;
    location: string;
    bio: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  lastLogin: Date;
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Features:**
- User authentication and authorization
- Role-based access control
- Profile management
- User preferences (theme, language, notifications)
- Company association
- Virtual `fullName` property

### 3. Queue Model (`Queue`)

Represents call queues within the call center.

```typescript
interface IQueue {
  name: string;
  description: string;
  type: 'inbound' | 'outbound' | 'blended';
  status: 'active' | 'inactive' | 'maintenance';
  settings: {
    maxWaitTime: number;
    serviceLevel: number;
    overflow: {
      enabled: boolean;
      targetQueue: mongoose.Types.ObjectId;
      waitTime: number;
    };
    callback: {
      enabled: boolean;
      maxAttempts: number;
      interval: number;
    };
    recording: {
      enabled: boolean;
      quality: 'low' | 'medium' | 'high';
      retention: number;
    };
  };
  metrics: {
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    serviceLevel: number;
    lastUpdated: Date;
  };
  agents: mongoose.Types.ObjectId[];
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Features:**
- Queue configuration and management
- Overflow and callback settings
- Recording preferences
- Real-time metrics tracking
- Agent assignment
- Automatic metric updates via `updateMetrics()` method

### 4. Call Data Model (`CallData`)

Represents individual call records and interactions.

```typescript
interface ICallData {
  callId: string;
  direction: 'inbound' | 'outbound';
  status: 'ringing' | 'answered' | 'abandoned' | 'completed' | 'failed';
  customer: {
    name: string;
    phone: string;
    email?: string;
    accountNumber?: string;
  };
  agent: mongoose.Types.ObjectId;
  queue: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  timing: {
    startTime: Date;
    answerTime?: Date;
    endTime?: Date;
    waitTime: number;
    handleTime: number;
    talkTime: number;
    holdTime: number;
  };
  outcome: {
    resolved: boolean;
    category: string;
    subcategory?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes?: string;
    tags: string[];
  };
  recording?: {
    url: string;
    duration: number;
    size: number;
    format: string;
  };
  quality: {
    satisfaction?: number;
    qualityScore?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    issues?: string[];
  };
  metadata: {
    source: string;
    campaign?: string;
    disposition: string;
    transferred: boolean;
    conference: boolean;
    ivrPath?: string[];
    skills: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Features:**
- Comprehensive call tracking
- Customer information
- Detailed timing metrics
- Call outcome and categorization
- Recording metadata
- Quality assessment
- Call metadata and skills
- Automatic time calculations via pre-save middleware

### 5. Analytics Model (`Analytics`)

Represents aggregated analytics data for reporting and insights.

```typescript
interface IAnalytics {
  company: mongoose.Types.ObjectId;
  date: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  callCenter: {
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    missedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    averageTalkTime: number;
    serviceLevel: number;
    occupancy: number;
    efficiency: number;
  };
  queues: Array<{
    queue: mongoose.Types.ObjectId;
    queueName: string;
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    serviceLevel: number;
    longestWaitTime: number;
  }>;
  agents: Array<{
    agent: mongoose.Types.ObjectId;
    agentName: string;
    totalCalls: number;
    answeredCalls: number;
    averageHandleTime: number;
    averageTalkTime: number;
    averageWrapTime: number;
    satisfaction: number;
    qualityScore: number;
    adherence: number;
  }>;
  performance: {
    callsPerHour: number;
    averageSpeedOfAnswer: number;
    abandonRate: number;
    firstCallResolution: number;
    customerSatisfaction: number;
    netPromoterScore?: number;
    costPerCall?: number;
    revenuePerCall?: number;
  };
  trends: {
    callVolume: number[];
    waitTimes: number[];
    handleTimes: number[];
    satisfaction: number[];
    serviceLevels: number[];
  };
  insights: {
    peakHours: number[];
    busyQueues: mongoose.Types.ObjectId[];
    topAgents: mongoose.Types.ObjectId[];
    issues: string[];
    recommendations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Features:**
- Time-based analytics aggregation
- Call center performance metrics
- Queue-specific analytics
- Agent performance tracking
- Key performance indicators (KPIs)
- Trend analysis
- Insights and recommendations
- Flexible time periods (hourly, daily, weekly, monthly)

### 6. Dashboard Model (`Dashboard`)

Represents user-configurable dashboards and layouts.

```typescript
interface IDashboard {
  name: string;
  description: string;
  type: 'main' | 'call-center' | 'queue-performance' | 'agent-performance' | 'custom';
  isDefault: boolean;
  isPublic: boolean;
  company: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  layout: {
    version: string;
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      config: {
        dataSource: string;
        filters: Record<string, any>;
        refreshInterval: number;
        chartType?: string;
        showLegend?: boolean;
        showGrid?: boolean;
        colorScheme?: string;
      };
      isVisible: boolean;
      isMinimized: boolean;
    }>;
  };
  filters: {
    dateRange: {
      start: Date;
      end: Date;
      preset?: string;
    };
    queues: mongoose.Types.ObjectId[];
    agents: mongoose.Types.ObjectId[];
    callTypes: string[];
    statuses: string[];
    customFilters: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  settings: {
    refreshInterval: number;
    autoRefresh: boolean;
    theme: 'light' | 'dark' | 'auto';
    density: 'compact' | 'normal' | 'comfortable';
    showTooltips: boolean;
    enableAnimations: boolean;
  };
  permissions: {
    viewers: mongoose.Types.ObjectId[];
    editors: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
  };
  lastAccessed: Date;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Features:**
- Configurable dashboard layouts
- Widget management and positioning
- Filter and data source configuration
- User permissions and access control
- Dashboard settings and preferences
- Access tracking and statistics
- Helper methods for widget management

## Database Services

### DBService

Generic CRUD operations for all models:

```typescript
class DBService {
  static async create<T>(model: any, data: any): Promise<T>
  static async findById<T>(model: any, id: string): Promise<T | null>
  static async findOne<T>(model: any, query: any): Promise<T | null>
  static async find<T>(model: any, query: any = {}, options: any = {}): Promise<T[]>
  static async update<T>(model: any, id: string, data: any): Promise<T | null>
  static async delete(model: any, id: string): Promise<boolean>
  static async count(model: any, query: any = {}): Promise<number>
  static async aggregate(model: any, pipeline: any[]): Promise<any[]>
}
```

### Model-Specific Services

- **CompanyService**: Company-specific operations
- **UserService**: User management and authentication
- **QueueService**: Queue operations and metrics
- **CallDataService**: Call data analysis and statistics
- **AnalyticsService**: Analytics data generation and retrieval
- **DashboardService**: Dashboard configuration and management

## Database Configuration

### Connection Management

```typescript
class MongoDBConnection {
  public async connect(): Promise<void>
  public async disconnect(): Promise<void>
  public getConnectionStatus(): string
  public isHealthy(): boolean
}
```

### Features

- **Connection Pooling**: Optimized for high-performance applications
- **Health Monitoring**: Real-time connection status checks
- **Automatic Reconnection**: Handles connection drops gracefully
- **Error Handling**: Comprehensive error management
- **Index Optimization**: Strategic indexing for query performance

## API Endpoints

### Database Management

- `GET/POST /api/init-db` - Initialize and seed database
- `GET /api/health/mongodb` - MongoDB health check

### Data Access

- `GET /api/dashboard` - Main dashboard data
- `GET /api/realtime` - Real-time data updates
- `GET /api/analytics` - Analytics and insights

## Usage Examples

### Basic Operations

```typescript
// Create a new company
const company = await CompanyService.create(Company, {
  name: 'WesalPulse Demo',
  domain: 'demo.wesalpulse.com',
  settings: { /* ... */ }
});

// Get all users for a company
const users = await UserService.getUsersByCompany(company._id.toString());

// Create analytics for today
const analytics = await AnalyticsService.createDailyAnalytics(company._id.toString(), new Date());
```

### Advanced Queries

```typescript
// Get calls by date range
const calls = await CallDataService.getCallsByDateRange(
  companyId,
  startDate,
  endDate
);

// Get call statistics
const stats = await CallDataService.getCallStats(
  companyId,
  startDate,
  endDate
);
```

## Security Considerations

1. **Authentication**: All database operations require valid user sessions
2. **Authorization**: Role-based access control for sensitive operations
3. **Data Validation**: Strict schema validation for all models
4. **Connection Security**: Secure MongoDB connection with TLS/SSL
5. **Input Sanitization**: Prevention of NoSQL injection attacks

## Performance Optimization

1. **Indexing**: Strategic indexes on frequently queried fields
2. **Connection Pooling**: Efficient connection management
3. **Query Optimization**: Efficient MongoDB aggregation pipelines
4. **Caching**: Application-level caching for frequently accessed data
5. **Pagination**: Large result sets are paginated

## Error Handling

All database operations include comprehensive error handling:

```typescript
try {
  const result = await CompanyService.create(Company, data);
  return successResponse(result);
} catch (error) {
  console.error('Database operation failed:', error);
  return errorResponse('Database operation failed', 500);
}
```

## Migration and Seeding

The system includes automated database seeding with sample data:

```typescript
await seedDatabase();
```

This creates:
- 1 Sample Company
- 3 Sample Users (Admin, Manager, Agent)
- 3 Sample Queues (Sales, Support, Technical)
- 2 Sample Dashboards (Main, Agent Performance)

### Database Initialization

To initialize the database with sample data:

```bash
# Using npm script
npm run init-db

# Or via API endpoint
GET /api/init-db
```

## Migration from Prisma

### Files Removed
- `prisma/schema.prisma` - Prisma schema file
- `src/lib/db.ts` - Prisma client configuration
- `db/custom.db` - SQLite database file
- Prisma-related npm packages

### Files Added
- `src/models/` - MongoDB model definitions
- `src/lib/mongodb.ts` - MongoDB service layer
- `src/lib/mongodb-config.ts` - MongoDB connection management
- `src/lib/mongodb-middleware.ts` - API middleware for MongoDB
- `src/lib/init-db.ts` - Database initialization utilities
- `src/app/api/init-db/route.ts` - Database initialization endpoint
- `src/app/api/health/mongodb/route.ts` - MongoDB health check

### Package Scripts Updated
- Removed: `db:push`, `db:generate`, `db:migrate`, `db:reset`
- Added: `init-db` - Initialize MongoDB with sample data

## Conclusion

The MongoDB models provide a comprehensive foundation for the WesalPulse call center dashboard application, supporting all required functionality from user management to real-time analytics and reporting. The migration from Prisma to MongoDB provides better scalability, performance, and flexibility for future growth.