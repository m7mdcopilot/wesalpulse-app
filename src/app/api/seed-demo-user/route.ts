import { NextRequest, NextResponse } from 'next/server';
import { seedDemoUser } from '@/lib/seed-demo-user';

export async function GET(request: NextRequest) {
  try {
    await seedDemoUser();
    return NextResponse.json({ 
      success: true, 
      message: 'Demo user seeded successfully' 
    });
  } catch (error) {
    console.error('Error seeding demo user:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to seed demo user' 
      },
      { status: 500 }
    );
  }
}