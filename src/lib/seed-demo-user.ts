import { connectDB } from '@/lib/database';
import { UserService } from '@/services/UserService';
import mongoose from 'mongoose';
import { Company } from '@/models/CompanyModel';

async function seedDemoUser() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Check if demo company already exists
    let demoCompany = await Company.findOne({ name: 'WesalPulse Demo' });
    
    if (!demoCompany) {
      // Create demo company
      demoCompany = await Company.create({
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
        }
      });
      console.log('Demo company created:', demoCompany.name);
    } else {
      console.log('Demo company already exists:', demoCompany.name);
    }

    // Check if demo user already exists
    const existingUser = await UserService.getUserByEmail('demo@wesalpulse.com');
    
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    try {
      // Create demo user with company ObjectId
      const demoUser = await UserService.createUser({
        email: 'demo@wesalpulse.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
        department: 'IT',
        status: 'active',
        company: demoCompany._id.toString(),
        profile: {
          phone: '+1234567890',
          location: 'Demo City',
          bio: 'Demo user for testing purposes'
        }
      });

      console.log('Demo user created successfully:', demoUser);
    } catch (createError) {
      // Check if the error is a duplicate key error (user already exists)
      if (createError && typeof createError === 'object' && 'code' in createError && createError.code === 11000) {
        console.log('Demo user already exists (duplicate key error)');
      } else {
        console.error('Error creating demo user:', createError);
      }
    }
    
  } catch (error) {
    console.error('Error seeding demo user:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Export the function
export { seedDemoUser };

// Run if called directly
if (require.main === module) {
  seedDemoUser();
}