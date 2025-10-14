import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/UserService';

export async function GET(request: NextRequest) {
  try {
    const user = await UserService.getUserByEmail('demo@wesalpulse.com');
    
    if (user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Demo user exists',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          status: user.status
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Demo user does not exist' 
      });
    }
  } catch (error) {
    console.error('Error checking demo user:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to check demo user' 
      },
      { status: 500 }
    );
  }
}