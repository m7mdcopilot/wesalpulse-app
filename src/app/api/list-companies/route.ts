import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const companiesCollection = db.collection('companies');
    
    const companies = await companiesCollection.find({}).toArray();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Companies listed successfully',
      companies: companies.map(c => ({
        id: c._id,
        name: c.name,
        domain: c.domain
      }))
    });
    
  } catch (error) {
    console.error('Error listing companies:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to list companies',
        details: error.message 
      },
      { status: 500 }
    );
  }
}