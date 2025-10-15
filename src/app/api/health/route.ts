import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

async function healthCheck(req: NextRequest): Promise<NextResponse> {
  try {
    // Check MongoDB connection
    const connected = mongoose.connection.readyState === 1;
    
    if (!connected) {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }

    // Try to get database stats
    try {
      const stats = await mongoose.connection.db.stats();
      
      return NextResponse.json({
        status: 'healthy',
        message: 'All systems operational',
        database: {
          connected: true,
          collections: stats.collections,
          documents: stats.objects,
          dataSize: `${Math.round(stats.dataSize / 1024 / 1024)}MB`
        },
        timestamp: new Date().toISOString()
      });
    } catch (dbError) {
      return NextResponse.json({
        status: 'degraded',
        message: 'Database connected but stats unavailable',
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: 'System check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const GET = healthCheck;