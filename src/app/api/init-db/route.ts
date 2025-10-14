import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/init-db'

async function initDatabase(req: NextRequest): Promise<NextResponse> {
  try {
    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    }, { status: 200 })
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { 
        error: 'Database initialization failed', 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}

export const GET = initDatabase
export const POST = initDatabase