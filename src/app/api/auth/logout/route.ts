import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Logout API called');
    
    // Create response that clears the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the auth cookie with multiple approaches
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 0,
      path: '/',
      expires: new Date(0)
    });

    console.log('Auth cookie cleared, logout successful');
    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Logout failed' },
      { status: 500 }
    );
  }
}