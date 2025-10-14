import { NextRequest, NextResponse } from 'next/server'
import { asyncHandler } from '@/middlewares/error'
import { DashboardService } from '@/services/DashboardService'
import { Company } from '@/models'

async function getDashboardData(req: NextRequest): Promise<NextResponse> {
  try {
    // Get the first company from the database
    const companies = await Company.find().lean();
    
    if (!companies || companies.length === 0) {
      return NextResponse.json(
        { error: 'No company found', message: 'Please set up a company first' },
        { status: 404 }
      );
    }

    const company = companies[0];
    
    // Get real dashboard data from database
    const analyticsData = await DashboardService.getDashboardAnalytics(company._id.toString());
    
    // Format the data to match the expected frontend structure
    const formattedData = {
      company: {
        id: company._id.toString(),
        name: company.name,
        domain: company.domain,
        queues: [], // Will be populated if needed
        settings: {
          generalSettings: {
            integrationEnabled: true,
            genesysEnvironment: 'production',
            lastUpdated: new Date().toISOString()
          },
          usersManagement: {
            totalUsers: 5,
            activeUsers: 5,
            roles: ['admin', 'manager', 'supervisor', 'agent'],
            lastUpdated: new Date().toISOString()
          },
          notifications: {
            emailAlerts: true,
            smsAlerts: true,
            inAppNotifications: true,
            lastUpdated: new Date().toISOString()
          }
        }
      },
      userProfile: {
        id: 'default-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        department: 'Management',
        lastLogin: new Date().toISOString(),
        permissions: ['read', 'write', 'admin'],
        preferences: {}
      },
      dataView: {
        callCenterStatusToday: analyticsData.callCenterStatusToday,
        callCenterPerformance: analyticsData.callCenterPerformance,
        queuePerformance: analyticsData.queuePerformance,
        agentPerformance: analyticsData.agentPerformance
      },
      analytics: analyticsData.insights,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataFreshness: 'real-time',
        version: '1.0.0',
        refreshInterval: '30 seconds'
      }
    };
    
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export const GET = asyncHandler(getDashboardData)