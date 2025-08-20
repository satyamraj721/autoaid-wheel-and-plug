/**
 * AUTOAID 360 - Database Configuration
 * MongoDB connection with Mongoose
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses connection string from environment variable
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern connection options (Mongoose 6+ defaults)
      // useNewUrlParser and useUnifiedTopology are no longer needed
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗃️  Database: ${conn.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Exit process with failure code
    process.exit(1);
  }
};

/**
 * Gracefully close database connection
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};