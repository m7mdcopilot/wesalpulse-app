import mongoose from 'mongoose';

// MongoDB connection options
const mongoOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  bufferCommands: false,
};

// Connection states
const CONNECTION_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3
} as const;

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse';
      
      await mongoose.connect(mongoURI, mongoOptions);
      
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Set up connection event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ Failed to disconnect from MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): string {
    const state = mongoose.connection.readyState;
    switch (state) {
      case CONNECTION_STATES.CONNECTED:
        return 'Connected';
      case CONNECTION_STATES.CONNECTING:
        return 'Connecting';
      case CONNECTION_STATES.DISCONNECTING:
        return 'Disconnecting';
      case CONNECTION_STATES.DISCONNECTED:
      default:
        return 'Disconnected';
    }
  }

  public isHealthy(): boolean {
    return this.isConnected && mongoose.connection.readyState === CONNECTION_STATES.CONNECTED;
  }
}

// Export singleton instance
export const mongoDBConnection = MongoDBConnection.getInstance();

// Export connection function for backward compatibility
export const connectToMongoDB = async (): Promise<void> => {
  await mongoDBConnection.connect();
};

// Export utility functions
export const getMongoDBStats = async () => {
  if (!mongoDBConnection.isHealthy()) {
    throw new Error('MongoDB is not connected');
  }

  const db = mongoose.connection.db;
  const stats = await db.stats();
  
  return {
    collections: stats.collections,
    documents: stats.objects,
    dataSize: stats.dataSize,
    storageSize: stats.storageSize,
    indexes: stats.indexes,
    indexSize: stats.indexSize
  };
};

export const checkMongoDBHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  details: {
    connection: string;
    responseTime: number;
    stats?: any;
  };
}> => {
  const startTime = Date.now();
  
  try {
    if (!mongoDBConnection.isHealthy()) {
      await mongoDBConnection.connect();
    }

    // Test database connection with a simple command
    await mongoose.connection.db.admin().ping();
    
    const responseTime = Date.now() - startTime;
    const stats = await getMongoDBStats();
    
    return {
      status: 'healthy',
      details: {
        connection: mongoDBConnection.getConnectionStatus(),
        responseTime,
        stats
      }
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'unhealthy',
      details: {
        connection: mongoDBConnection.getConnectionStatus(),
        responseTime
      }
    };
  }
};