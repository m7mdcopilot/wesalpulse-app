# Wesal Call Center Dashboard

A comprehensive call center status dashboard built with Next.js, TypeScript, and MongoDB, providing real-time analytics and performance metrics.

## Features

### 🎯 Core Dashboard Widgets
- **Current Call Status**: Active calls, agent availability, utilization rates
- **Call Outcomes**: Answered vs abandoned calls, answer rates
- **Call Handling Metrics**: Average handle time, talk time, service levels

### 📊 Advanced Analytics
- **Call Center Performance**: Overview metrics with trend analysis
- **Queue Performance**: Individual queue metrics and waiting times
- **Agent Performance**: Individual agent productivity and satisfaction scores
- **Real-time Data**: Live updates with configurable refresh intervals

### 🏗️ Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO for live updates
- **State Management**: Zustand + TanStack Query

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB connection (URI configured in environment)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/m7mdcopilot/wesalpulse-app.git
cd wesalpulse-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# Initialize database with company, users, queues, and dashboards
npm run init-db

# Seed with simple test call data (recommended for quick start)
npm run seed-simple-calls

# Or seed with comprehensive 7-day call data
npm run seed-call-data

# One-command setup: initialize database and seed with simple data
npm run setup-all
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser and log in**
Navigate to [http://localhost:3000](http://localhost:3000) and use any of the demo accounts:

- **Admin**: `admin@wesalpulse.com` (password: `password`)
- **Manager**: `manager@wesalpulse.com` (password: `password`)
- **Supervisor**: `supervisor@wesalpulse.com` (password: `password`)
- **Agent 1**: `agent1@wesalpulse.com` (password: `password`)
- **Agent 2**: `agent2@wesalpulse.com` (password: `password`)

## Database Seeding Options

### 1. Basic Setup (`npm run setup-all`)
- Creates company, users, queues, and dashboards
- Seeds with simple test call data (7 calls: 5 answered, 2 abandoned)
- Perfect for quick testing and demonstration

### Demo Users
After running the database initialization, you can use these demo accounts (password: `password` for all):

- **Admin**: `admin@wesalpulse.com` - Full system access
- **Manager**: `manager@wesalpulse.com` - Operational management
- **Supervisor**: `supervisor@wesalpulse.com` - Quality assurance and monitoring
- **Agent 1**: `agent1@wesalpulse.com` - Customer service agent
- **Agent 2**: `agent2@wesalpulse.com` - Customer service agent

### 2. Simple Call Data (`npm run seed-simple-calls`)
- Creates 7 test calls with realistic metrics
- Includes answered and abandoned calls
- Good for basic functionality testing

### 3. Comprehensive Call Data (`npm run seed-call-data`)
- Generates 699+ calls over 7 days
- Includes detailed customer information, agent assignments
- Realistic call patterns, wait times, and outcomes
- Perfect for stress testing and realistic demonstrations

### 4. Today's Calls (`npm run seed-today-calls`)
- Creates calls specifically for today
- Includes active calls, recent completed calls, abandoned calls
- Good for testing real-time dashboard functionality

## API Endpoints

### Database Management
- `GET /api/init-db` - Initialize database with company structure
- `GET /api/seed-call-data` - Seed comprehensive call data
- `GET /api/seed-simple-calls` - Seed simple test calls
- `GET /api/seed-today-calls` - Seed today's calls

### Dashboard Data
- `GET /api/dashboard` - Main dashboard data with real metrics
- `GET /api/realtime` - Real-time data updates via Socket.IO
- `GET /api/analytics` - Analytics and insights

### Health Checks
- `GET /api/health/mongodb` - MongoDB connection status

## Dashboard Metrics Explained

### Current Call Status
- **Active Calls**: Currently ongoing calls
- **Total Agents**: Number of available agents
- **Available Agents**: Agents ready to take calls
- **Utilization Rate**: Percentage of active agents vs total

### Call Outcomes
- **Answered**: Successfully connected calls
- **Abandoned**: Customer hung up before answer
- **Answer Rate**: (Answered / Total) × 100%

### Call Handling Metrics
- **Average Handle Time**: Total call duration including talk and wrap-up
- **Average Talk Time**: Actual conversation time
- **Average Wrap-Up Time**: Post-call work time
- **Service Level**: Percentage of calls answered within target time

## Configuration

### Environment Variables
```bash
MONGODB_URI=mongodb+srv://your-connection-string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Customization
- **Dashboard Layout**: Edit widget positions and sizes
- **Data Filters**: Configure date ranges, queues, agents
- **Refresh Intervals**: Adjust real-time update frequency
- **Theme**: Light/dark mode support

## Development

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── dashboard-*/      # Dashboard-specific components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   └── seed-*.ts        # Data seeding scripts
├── models/               # MongoDB/Mongoose models
├── services/             # Business logic services
└── hooks/                # Custom React hooks
```

### Adding New Widgets
1. Create widget component in `src/components/dashboard-wrappers/`
2. Add widget type to DashboardService
3. Update dashboard layout configuration
4. Test with seeded data

### Database Schema
The application uses MongoDB with the following main collections:
- **Company**: Organization settings and configuration
- **User**: Agent and administrator accounts
- **Queue**: Call routing and management
- **CallData**: Individual call records and metrics
- **Analytics**: Aggregated performance data
- **Dashboard**: User-configurable dashboard layouts

## Production Deployment

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Setup
1. Configure production MongoDB URI
2. Set up proper authentication (NextAuth.js)
3. Configure CORS and security headers
4. Set up monitoring and logging

## Troubleshooting

### Database Connection Issues
- Verify MongoDB URI is correct
- Check network connectivity
- Ensure MongoDB credentials are valid

### Empty Dashboard Data
- Run database seeding: `npm run setup-all`
- Check API endpoints are responding
- Verify browser console for errors

### Real-time Updates Not Working
- Ensure Socket.IO server is running
- Check WebSocket connection in browser
- Verify firewall settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the MongoDB models documentation

---

**Built with ❤️ for Wesal Call Center**