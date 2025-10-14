import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/UserService';
import { getTokenFromRequest, parseAuthToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing authentication token' },
        { status: 401 }
      );
    }

    // Parse token to get credentials
    const credentials = parseAuthToken(token);
    
    if (!credentials) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Authenticate user
    const user = await UserService.authenticateUser(credentials.email, credentials.password);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        status: user.status,
        company: user.company
      }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get user info' },
      { status: 500 }
    );
  }
}