import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Here you would typically load from a database
    // For now, we'll return an empty response to indicate no saved configuration
    // This allows the client to use its default configuration
    
    console.log('Loading widget configuration')

    // Simulate database load delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // Return empty response - client will use defaults
    return NextResponse.json({
      widgetOrder: null,
      widgetItemOrders: null,
      availableWidgets: null,
      message: 'No saved configuration found, using defaults'
    })
  } catch (error) {
    console.error('Error loading widget configuration:', error)
    return NextResponse.json(
      { error: 'Failed to load widget configuration' },
      { status: 500 }
    )
  }
}