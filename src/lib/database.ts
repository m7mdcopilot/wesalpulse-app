import mongoose from 'mongoose';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://wesalpulse:YjdPpZWDAUnBZ6n3@cluster0.9kp5oc2.mongodb.net/wesalpulse';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Disconnect from MongoDB
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

// Get connection status
export const getDBStatus = () => {
  return {
    state: mongoose.connection.readyState,
    states: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
  };
};