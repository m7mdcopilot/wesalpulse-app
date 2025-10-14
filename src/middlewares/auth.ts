import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/UserService';

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

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

/**
 * Authentication middleware
 */
export async function authMiddleware(req: NextRequest): Promise<NextResponse | AuthUser> {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // For now, we'll use a simple token-based authentication
    // In a real application, you would verify JWT tokens here
    const [email, password] = Buffer.from(token, 'base64').toString().split(':');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Authenticate user
    const user = await UserService.authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Account is not active' },
        { status: 403 }
      );
    }

    // Return user object for use in route handlers
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      status: user.status,
      company: user.company.toString()
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Role-based access control middleware
 */
export function roleMiddleware(allowedRoles: string[]) {
  return async (req: NextRequest): Promise<NextResponse | void> => {
    const authResult = await authMiddleware(req);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const user = authResult as AuthUser;

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // If we reach here, the user has the required role
    // We'll attach the user to the request in the route handler
  };
}

/**
 * Company access middleware - ensures user has access to the specified company
 */
export async function companyAccessMiddleware(req: NextRequest, companyId: string): Promise<NextResponse | void> {
  const authResult = await authMiddleware(req);
  
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  const user = authResult as AuthUser;

  // Check if user belongs to the specified company
  if (user.company !== companyId) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Access denied to this company' },
      { status: 403 }
    );
  }

  // If we reach here, the user has access to the company
}

/**
 * Admin access middleware - ensures user has admin privileges
 */
export const adminMiddleware = roleMiddleware(['admin']);

/**
 * Manager access middleware - ensures user has manager or admin privileges
 */
export const managerMiddleware = roleMiddleware(['admin', 'manager']);

/**
 * Supervisor access middleware - ensures user has supervisor, manager, or admin privileges
 */
export const supervisorMiddleware = roleMiddleware(['admin', 'manager', 'supervisor']);

/**
 * Create authentication token for testing
 */
export function createAuthToken(email: string, password: string): string {
  const credentials = `${email}:${password}`;
  return Buffer.from(credentials).toString('base64');
}