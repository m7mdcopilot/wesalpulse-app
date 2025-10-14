import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/UserService';

export class UserController {
  /**
   * Get user by ID
   */
  static async getUser(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const user = await UserService.getUserById(params.id);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found', message: 'User does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch user' },
        { status: 500 }
      );
    }
  }

  /**
   * Get all users (with pagination and filtering)
   */
  static async getUsers(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      const role = searchParams.get('role') || '';
      const status = searchParams.get('status') || '';
      const companyId = searchParams.get('companyId') || '';

      const result = await UserService.getUsers({ 
        page, 
        limit, 
        search, 
        role, 
        status, 
        companyId 
      });

      return NextResponse.json({
        success: true,
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch users' },
        { status: 500 }
      );
    }
  }

  /**
   * Create new user
   */
  static async createUser(req: NextRequest) {
    try {
      const body = await req.json();

      const user = await UserService.createUser(body);

      return NextResponse.json({
        success: true,
        data: user,
        message: 'User created successfully'
      }, { status: 201 });
    } catch (error) {
      console.error('Create user error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create user' },
        { status: 500 }
      );
    }
  }

  /**
   * Update user
   */
  static async updateUser(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();

      const user = await UserService.updateUser(params.id, body);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found', message: 'User does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Update user error:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Validation Error', message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update user' },
        { status: 500 }
      );
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const success = await UserService.deleteUser(params.id);

      if (!success) {
        return NextResponse.json(
          { error: 'User not found', message: 'User does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to delete user' },
        { status: 500 }
      );
    }
  }

  /**
   * Get users by company
   */
  static async getUsersByCompany(req: NextRequest, { params }: { params: { companyId: string } }) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const role = searchParams.get('role') || '';
      const status = searchParams.get('status') || '';

      const result = await UserService.getUsersByCompany(params.companyId, {
        page, limit, role, status
      });

      return NextResponse.json({
        success: true,
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get users by company error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch users by company' },
        { status: 500 }
      );
    }
  }

  /**
   * Update user status
   */
  static async updateUserStatus(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const { status } = body;

      const user = await UserService.updateUserStatus(params.id, status);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found', message: 'User does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user,
        message: 'User status updated successfully'
      });
    } catch (error) {
      console.error('Update user status error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update user status' },
        { status: 500 }
      );
    }
  }

  /**
   * Update user last login
   */
  static async updateUserLastLogin(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const user = await UserService.updateUserLastLogin(params.id);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found', message: 'User does not exist' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user,
        message: 'User last login updated successfully'
      });
    } catch (error) {
      console.error('Update user last login error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update user last login' },
        { status: 500 }
      );
    }
  }
}