import mongoose, { Schema, Document } from 'mongoose';
import { userSchema, IUser } from './User';
import { connectDB } from '@/lib/database';

// Create the User model
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// Ensure database is connected before using the model
const ensureConnected = async () => {
  await connectDB();
  return UserModel;
};

// Create a wrapper that ensures connection
class UserWrapper {
  static async ensureConnection() {
    await ensureConnected();
    return UserModel;
  }
  
  static async findById(id: string) {
    await this.ensureConnection();
    return UserModel.findById(id);
  }
  
  static async findOne(query: any) {
    await this.ensureConnection();
    return UserModel.findOne(query);
  }
  
  static async find(query: any = {}) {
    await this.ensureConnection();
    return UserModel.find(query);
  }
  
  static async create(data: any) {
    await this.ensureConnection();
    return UserModel.create(data);
  }
  
  static async findByIdAndUpdate(id: string, update: any, options: any = {}) {
    await this.ensureConnection();
    return UserModel.findByIdAndUpdate(id, update, options);
  }
  
  static async findByIdAndDelete(id: string) {
    await this.ensureConnection();
    return UserModel.findByIdAndDelete(id);
  }
  
  static async countDocuments(query: any = {}) {
    await this.ensureConnection();
    return UserModel.countDocuments(query);
  }
  
  // Add any other methods you need
}

// Export the wrapper
export const User = UserWrapper;
export default UserModel;