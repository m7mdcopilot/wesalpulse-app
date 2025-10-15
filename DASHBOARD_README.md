# Genesys Cloud Dashboard Queues Performance Summary

This project implements a comprehensive Dashboard Queues Performance Summary view for Genesys Cloud, built with Next.js 15 and TypeScript.

## Features

### 🎯 Key Metrics Displayed
- **Total Interactions**: Offered, handled, and abandoned interactions
- **Average Wait Time**: Including longest wait time
- **Service Level %**: With color-coded performance indicators
- **Agent Availability**: Available vs total agents on queue
- **Average Handle Time**: Per interaction type
- **Occupancy Rates**: Agent utilization metrics

### 🔌 Genesys Cloud API Integration
- **Analytics API**: Uses `/api/v2/analytics/queues/aggregates/query` for historical metrics
- **Conversation Analytics**: Uses `/api/v2/analytics/conversations/aggregates/query` for trend data
- **OAuth 2.0 Authentication**: Secure client credentials flow
- **Rate Limiting**: Built-in handling for API limits and retries

### 🕒 Time Range Support
- Last Hour
- Last 24 Hours
- Today
- Last 7 Days
- Custom Date Range (with ISO 8601 timestamps)

### 🧩 Media Type Filtering
- Voice
- Chat
- Email
- Callback
- All Media Types

### 🎨 UI/UX Components
- **Summary Cards**: Key metrics at a glance
- **Data Table**: Detailed queue performance with color-coded indicators
- **Interactive Charts**: Line and bar charts for trend visualization
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Skeleton loaders during data fetch
- **Error Handling**: Graceful fallbacks and user feedback

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI based)
- **Charts**: Recharts
- **State Management**: React hooks
- **API**: TanStack Query ready architecture
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── dashboard/
│   │       └── route.ts          # Dashboard API endpoint
│   ├── page.tsx                  # Main dashboard component
│   └── layout.tsx                # Root layout
├── components/
│   └── ui/                       # shadcn/ui components
├── hooks/
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notifications
└── lib/
    ├── genesys-service.ts        # Genesys Cloud API service
    ├── utils.ts                  # Utility functions
    └── db.ts                     # Database connection
```

## API Endpoints

### `GET /api/dashboard`
Fetches dashboard data with optional query parameters:

**Query Parameters:**
- `timeRange`: `last_hour` | `last_24_hours` | `today` | `last_7_days` | `custom`
- `mediaType`: `voice` | `chat` | `email` | `callback` | `all`

**Response:**
```json
{
  "queueMetrics": [...],
  "summaryMetrics": {...},
  "trendData": [...]
}
```

## Configuration

### Environment Variables
Create a `.env.local` file with:

```env
GENESYS_CLOUD_API_URL=https://api.mypurecloud.com
GENESYS_CLIENT_ID=your_client_id
GENESYS_CLIENT_SECRET=your_client_secret
```

### Genesys Cloud Setup
1. Create OAuth client in Genesys Cloud
2. Grant necessary permissions for Analytics APIs
3. Configure queue and routing settings
4. Set up appropriate roles and permissions

## Development

### Prerequisites
- Node.js 18+
- Genesys Cloud organization with API access

### Setup
```bash
npm install
npm run dev
```

### Available Scripts
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run lint`: ESLint check

## Key Implementation Details

### 1. Purpose-Driven Design
The dashboard focuses on clarity over volume, displaying only the most critical KPIs for queue performance management.

### 2. API Optimization
- Uses aggregate queries for better performance
- Implements caching strategies
- Handles pagination and rate limiting
- Exponential backoff for retries

### 3. Real-time vs Historical Data
- Historical data via Analytics API
- Ready for WebSocket integration for real-time updates
- Clear labeling of data sources

### 4. Security
- OAuth 2.0 client credentials flow
- Environment variable for secrets
- Role-based access control ready

### 5. Performance Considerations
- Efficient data fetching with parallel requests
- Debounced refresh functionality
- Optimistic UI updates
- Loading states for better UX

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Real-time WebSocket integration
- Advanced filtering options
- Export functionality (CSV, PDF)
- Custom alert thresholds
- Historical comparison views
- Agent performance metrics
- SLA breach notifications

## Contributing

1. Follow the established code patterns
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add appropriate tests
5. Update documentation

## License

This project is part of the Genesys Cloud ecosystem.