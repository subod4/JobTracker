const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    
    // Check if we should use local default or if no custom URI is provided
    if (!dbUri || dbUri === 'mongodb://127.0.0.1:27017/jobtracker' || dbUri === 'mongodb://localhost:27017/jobtracker') {
      // Try to connect to local MongoDB first, but with a short timeout
      try {
        const conn = await mongoose.connect(dbUri || 'mongodb://127.0.0.1:27017/jobtracker', {
          serverSelectionTimeoutMS: 2000 // 2 seconds timeout
        });
        console.log(`MongoDB Connected locally: ${conn.connection.host}`);
        return;
      } catch (localError) {
        // Local MongoDB not running, fall back to in-memory
      }

      // Fallback to memory server
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } else {
      // Custom external DB URI provided (e.g. MongoDB Atlas)
      const conn = await mongoose.connect(dbUri);
      console.log(`External MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
