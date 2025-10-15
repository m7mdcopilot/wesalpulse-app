import { NextRequest, NextResponse } from 'next/server'
import { getQueues } from '@/lib/genesys-service'

export async function GET(request: NextRequest) {
  try {
    // Fetch available queues from Genesys Cloud API
    const queues = await getQueues()

    return NextResponse.json(queues)
  } catch (error) {
    console.error('Error fetching queues:', error)
    
    // Return mock data for development/testing
    const mockQueues = [
      { id: '1', name: 'Sales Support', mediaTypes: ['voice', 'chat'] },
      { id: '2', name: 'Technical Support', mediaTypes: ['voice', 'email', 'callback'] },
      { id: '3', name: 'Customer Service', mediaTypes: ['chat', 'email'] },
      { id: '4', name: 'Billing Support', mediaTypes: ['email', 'callback'] },
      { id: '5', name: 'Product Support', mediaTypes: ['voice', 'chat', 'email'] },
      { id: '6', name: 'Enterprise Support', mediaTypes: ['voice', 'email', 'callback'] },
      { id: '7', name: 'Sales Inquiries', mediaTypes: ['voice', 'chat'] },
      { id: '8', name: 'Technical Escalation', mediaTypes: ['voice', 'email'] },
      { id: '9', name: 'Customer Success', mediaTypes: ['chat', 'email'] },
      { id: '10', name: 'Billing Disputes', mediaTypes: ['email', 'callback'] }
    ]

    return NextResponse.json(mockQueues)
  }
}