import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, validateTokenFormat } from '@/lib/auth-utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/privacy-policy', '/terms-of-use'];
  
  // Define static file patterns that should be accessible without authentication
  const staticPatterns = ['/images/', '/favicon.ico', '/_next/static/', '/_next/image/'];
  
  // Check if the current path is a static file
  const isStaticFile = staticPatterns.some(pattern => 
    pathname.startsWith(pattern) || pathname === pattern.replace('/', '')
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // If it's a static file or public route, allow access
  if (isStaticFile || isPublicRoute) {
    // If user is already authenticated and tries to access login page, redirect to home
    if (pathname === '/login') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken && validateTokenFormat(authToken)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  const authToken = request.cookies.get('auth-token')?.value;
  
  if (!authToken || !validateTokenFormat(authToken)) {
    // No auth token or invalid format, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Token format is valid, continue with the request
  // The actual authentication will happen in the API route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};