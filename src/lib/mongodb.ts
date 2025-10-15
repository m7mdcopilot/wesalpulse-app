import { connectDB } from '@/models';
import mongoose from 'mongoose';

// Database connection utility
export const ensureDBConnection = async () => {
  try {
    await connectDB();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Generic CRUD operations
export class DBService {
  static async create<T>(model: any, data: any): Promise<T> {
    try {
      const result = await model.create(data);
      return result.toObject();
    } catch (error) {
      console.error(`Error creating ${model.modelName}:`, error);
      throw error;
    }
  }

  static async findById<T>(model: any, id: string): Promise<T | null> {
    try {
      const result = await model.findById(id).lean();
      return result;
    } catch (error) {
      console.error(`Error finding ${model.modelName} by ID:`, error);
      throw error;
    }
  }

  static async findOne<T>(model: any, query: any): Promise<T | null> {
    try {
      const result = await model.findOne(query).lean();
      return result;
    } catch (error) {
      console.error(`Error finding ${model.modelName}:`, error);
      throw error;
    }
  }

  static async find<T>(model: any, query: any = {}, options: any = {}): Promise<T[]> {
    try {
      const { limit = 0, skip = 0, sort = {}, populate = [] } = options;
      
      let queryBuilder = model.find(query);
      
      if (limit > 0) queryBuilder = queryBuilder.limit(limit);
      if (skip > 0) queryBuilder = queryBuilder.skip(skip);
      if (Object.keys(sort).length > 0) queryBuilder = queryBuilder.sort(sort);
      
      if (populate.length > 0) {
        populate.forEach((pop: any) => {
          queryBuilder = queryBuilder.populate(pop);
        });
      }
      
      const results = await queryBuilder.lean();
      return results;
    } catch (error) {
      console.error(`Error finding ${model.modelName}s:`, error);
      throw error;
    }
  }

  static async update<T>(model: any, id: string, data: any): Promise<T | null> {
    try {
      const result = await model.findByIdAndUpdate(id, data, { new: true }).lean();
      return result;
    } catch (error) {
      console.error(`Error updating ${model.modelName}:`, error);
      throw error;
    }
  }

  static async delete(model: any, id: string): Promise<boolean> {
    try {
      const result = await model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(`Error deleting ${model.modelName}:`, error);
      throw error;
    }
  }

  static async count(model: any, query: any = {}): Promise<number> {
    try {
      return await model.countDocuments(query);
    } catch (error) {
      console.error(`Error counting ${model.modelName}s:`, error);
      throw error;
    }
  }

  static async aggregate(model: any, pipeline: any[]): Promise<any[]> {
    try {
      return await model.aggregate(pipeline);
    } catch (error) {
      console.error(`Error aggregating ${model.modelName}:`, error);
      throw error;
    }
  }
}