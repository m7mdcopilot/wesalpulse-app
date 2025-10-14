import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if demo user already exists
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email: 'demo@wesalpulse.com' });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'Demo user already exists',
        user: {
          id: existingUser._id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName
        }
      });
    }
    
    // Get demo company
    const companiesCollection = db.collection('companies');
    const demoCompany = await companiesCollection.findOne({ domain: 'demo.wesalpulse.com' });
    
    if (!demoCompany) {
      return NextResponse.json({ 
        success: false, 
        message: 'Demo company not found' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    // Create demo user
    const newUser = {
      email: 'demo@wesalpulse.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
      department: 'IT',
      status: 'active',
      company: demoCompany._id,
      profile: {
        avatar: '',
        phone: '+1234567890',
        extension: '',
        location: 'Demo City',
        bio: 'Demo user for testing purposes'
      },
      preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Demo user created successfully',
      user: {
        id: result.insertedId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
    
  } catch (error) {
    console.error('Error creating demo user:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to create demo user',
        details: error.message 
      },
      { status: 500 }
    );
  }
}