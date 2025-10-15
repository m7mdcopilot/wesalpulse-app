import mongoose, { Schema, Document } from 'mongoose';
import { companySchema, ICompany } from './Company';
import { connectDB } from '@/lib/database';

// Create the Company model
const CompanyModel = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

// Ensure database is connected before using the model
const ensureConnected = async () => {
  await connectDB();
  return CompanyModel;
};

// Create a wrapper that ensures connection
class CompanyWrapper {
  static async ensureConnection() {
    await ensureConnected();
    return CompanyModel;
  }
  
  static async findById(id: string) {
    await this.ensureConnection();
    return CompanyModel.findById(id);
  }
  
  static async findOne(query: any) {
    await this.ensureConnection();
    return CompanyModel.findOne(query);
  }
  
  static async find(query: any = {}) {
    await this.ensureConnection();
    return CompanyModel.find(query);
  }
  
  static async create(data: any) {
    await this.ensureConnection();
    return CompanyModel.create(data);
  }
  
  static async findByIdAndUpdate(id: string, update: any, options: any = {}) {
    await this.ensureConnection();
    return CompanyModel.findByIdAndUpdate(id, update, options);
  }
  
  static async findByIdAndDelete(id: string) {
    await this.ensureConnection();
    return CompanyModel.findByIdAndDelete(id);
  }
  
  static async countDocuments(query: any = {}) {
    await this.ensureConnection();
    return CompanyModel.countDocuments(query);
  }
  
  // Add any other methods you need
}

// Export the wrapper
export const Company = CompanyWrapper;
export default CompanyModel;