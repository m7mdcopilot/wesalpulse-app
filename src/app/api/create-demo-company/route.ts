import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const companiesCollection = db.collection('companies');
    
    // Check if demo company already exists
    const existingCompany = await companiesCollection.findOne({ name: 'WesalPulse Demo' });
    
    if (existingCompany) {
      return NextResponse.json({ 
        success: true, 
        message: 'Demo company already exists',
        company: {
          id: existingCompany._id,
          name: existingCompany.name,
          domain: existingCompany.domain
        }
      });
    }
    
    // Create demo company
    const newCompany = {
      name: 'WesalPulse Demo',
      domain: 'demo.wesalpulse.com',
      settings: {
        general: {
          timezone: 'UTC',
          businessHours: {
            start: '09:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5]
          },
          language: 'en',
          currency: 'USD'
        },
        users: {
          maxUsers: 50,
          defaultRole: 'agent',
          requireTwoFactor: false
        },
        notifications: {
          email: true,
          sms: true,
          push: true,
          webhook: ''
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await companiesCollection.insertOne(newCompany);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Demo company created successfully',
      company: {
        id: result.insertedId,
        name: newCompany.name,
        domain: newCompany.domain
      }
    });
    
  } catch (error) {
    console.error('Error creating demo company:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to create demo company',
        details: error.message 
      },
      { status: 500 }
    );
  }
}