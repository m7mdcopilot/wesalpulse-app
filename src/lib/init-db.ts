import { ensureDBConnection } from '@/lib/mongodb';

export const initializeDatabase = async () => {
  try {
    // Ensure database connection
    await ensureDBConnection();
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

// Auto-initialize database when this module is imported
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(console.error);
}