import { User } from '@/models/UserModel';
import { connectDB } from '@/lib/database';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  companyId?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'manager' | 'supervisor' | 'agent';
  department: string;
  status?: 'active' | 'inactive' | 'suspended';
  profile?: {
    avatar?: string;
    phone?: string;
    extension?: string;
    location?: string;
    bio?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  company: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'supervisor' | 'agent';
  department?: string;
  status?: 'active' | 'inactive' | 'suspended';
  profile?: {
    avatar?: string;
    phone?: string;
    extension?: string;
    location?: string;
    bio?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
}

export class UserService {
  /**
   * Hash password
   */
  private static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  /**
   * Compare password
   */
  private static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    const user = await User.findById(id);
    if (user) {
      // Remove password from response
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }
    return null;
  }

  /**
   * Get users with filtering and pagination
   */
  static async getUsers(filters: UserFilters = {}) {
    const { page = 1, limit = 10, search = '', role = '', status = '', companyId = '' } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (companyId) {
      query.company = new mongoose.Types.ObjectId(companyId);
    }

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

    return { users: usersWithoutPasswords, total };
  }

  /**
   * Create new user
   */
  static async createUser(data: CreateUserData) {
    // Check if user with same email already exists
    const existingUser = await User.findOne({ 
      email: data.email.toLowerCase() 
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Prepare user data with defaults
    const userData = {
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || 'agent',
      status: data.status || 'active',
      profile: {
        avatar: data.profile?.avatar || '',
        phone: data.profile?.phone || '',
        extension: data.profile?.extension || '',
        location: data.profile?.location || '',
        bio: data.profile?.bio || ''
      },
      preferences: {
        theme: data.preferences?.theme || 'system',
        language: data.preferences?.language || 'en',
        timezone: data.preferences?.timezone || 'UTC',
        notifications: {
          email: data.preferences?.notifications?.email ?? true,
          sms: data.preferences?.notifications?.sms ?? true,
          push: data.preferences?.notifications?.push ?? true
        }
      }
    };

    const user = await User.create(userData);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UpdateUserData) {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return null;
    }

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await User.findOne({ 
        email: data.email.toLowerCase(),
        _id: { $ne: id }
      });

      if (emailExists) {
        throw new Error('User with this email already exists');
      }
    }

    const updateData: any = { ...data };
    
    if (data.email) {
      updateData.email = data.email.toLowerCase();
    }

    if (data.password) {
      updateData.password = await this.hashPassword(data.password);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    // Remove password from response
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }
    
    return null;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string) {
    const user = await User.findById(id);
    if (!user) {
      return false;
    }

    return await User.findByIdAndDelete(id) !== null;
  }

  /**
   * Get users by company
   */
  static async getUsersByCompany(companyId: string, filters: Omit<UserFilters, 'companyId'> = {}) {
    return await this.getUsers({ ...filters, companyId });
  }

  /**
   * Update user status
   */
  static async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
    const user = await DBService.update(User, id, { status });
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }

  /**
   * Update user last login
   */
  static async updateUserLastLogin(id: string) {
    const user = await User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
    
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }
    
    return null;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Include password for authentication purposes
      return user;
    }
    return null;
  }

  /**
   * Authenticate user
   */
  static async authenticateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.updateUserLastLogin(user._id.toString());

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get active users by company
   */
  static async getActiveUsersByCompany(companyId: string) {
    return await this.getUsersByCompany(companyId, { status: 'active' });
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(companyId: string, role: string) {
    return await this.getUsersByCompany(companyId, { role });
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics(companyId: string) {
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      managerUsers,
      supervisorUsers,
      agentUsers
    ] = await Promise.all([
      User.countDocuments({ company: companyId }),
      User.countDocuments({ company: companyId, status: 'active' }),
      User.countDocuments({ company: companyId, role: 'admin' }),
      User.countDocuments({ company: companyId, role: 'manager' }),
      User.countDocuments({ company: companyId, role: 'supervisor' }),
      User.countDocuments({ company: companyId, role: 'agent' })
    ]);

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: {
        admin: adminUsers,
        manager: managerUsers,
        supervisor: supervisorUsers,
        agent: agentUsers
      }
    };
  }
}