import { NextRequest, NextResponse } from 'next/server'
import { checkMongoDBHealth } from '@/lib/mongodb-config'

export async function GET(request: NextRequest) {
  try {
    const health = await checkMongoDBHealth()
    
    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
      details: health.details
    }, { status: health.status === 'healthy' ? 200 : 503 })
    
  } catch (error) {
    console.error('MongoDB health check error:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 503 }
    )
  }
}