import mongoose from 'mongoose';

const connect = async (uri) => {
  try {
    if (!uri) {
      throw new Error('MongoDB URI is not provided. Please check your ATLAS_URI environment variable.');
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('URI provided:', uri ? 'Yes' : 'No');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(uri, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

export default connect;