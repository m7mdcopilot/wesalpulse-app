import { NextRequest, NextResponse } from 'next/server'

// In a real application, you would use a database
// For this example, we'll use in-memory storage
let widgetConfigStorage: any = null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const { widgetOrder, widgetItemOrders, availableWidgets } = body
    
    if (!widgetOrder || !widgetItemOrders || !availableWidgets) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Save the configuration
    widgetConfigStorage = {
      widgetOrder,
      widgetItemOrders,
      availableWidgets,
      timestamp: new Date().toISOString()
    }
    
    console.log('Widget configuration saved:', widgetConfigStorage)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Widget configuration saved successfully',
      timestamp: widgetConfigStorage.timestamp
    })
  } catch (error) {
    console.error('Error saving widget configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}