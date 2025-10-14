import { NextRequest, NextResponse } from 'next/server';
import { mongoDBConnection } from './mongodb-config';

export async function withMongoDB(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Ensure MongoDB connection
      if (!mongoDBConnection.isHealthy()) {
        await mongoDBConnection.connect();
      }

      // Check connection health
      if (!mongoDBConnection.isHealthy()) {
        return NextResponse.json(
          { error: 'Database connection failed', message: 'Unable to connect to database' },
          { status: 503 }
        );
      }

      // Call the handler
      return await handler(req, context);
    } catch (error) {
      console.error('MongoDB middleware error:', error);
      
      return NextResponse.json(
        { 
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        },
        { status: 500 }
      );
    }
  };
}