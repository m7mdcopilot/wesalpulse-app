import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'supervisor' | 'agent';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  company: string;
}

/**
 * Create authentication token from credentials
 */
export function createAuthToken(email: string, password: string): string {
  const credentials = `${email}:${password}`;
  return Buffer.from(credentials).toString('base64');
}

/**
 * Parse authentication token
 */
export function parseAuthToken(token: string): { email: string; password: string } | null {
  try {
    const credentials = Buffer.from(token, 'base64').toString();
    const [email, password] = credentials.split(':');
    
    if (!email || !password) {
      return null;
    }
    
    return { email, password };
  } catch (error) {
    return null;
  }
}

/**
 * Validate token format
 */
export function validateTokenFormat(token: string): boolean {
  return parseAuthToken(token) !== null;
}

/**
 * Get token from request
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}