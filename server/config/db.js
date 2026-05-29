const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt connection with a short 2-second timeout so it doesn't hang if MongoDB is missing
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ca-ranker-ai', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`\n  =========================================`);
    console.log(`  🟢 MongoDB Connected: ${conn.connection.host}`);
    console.log(`  =========================================\n`);
    process.env.USE_JSON_DB = 'false';
  } catch (error) {
    console.log(`\n  =========================================`);
    console.log(`  ⚠️  MongoDB connection failed: ${error.message}`);
    console.log(`  🔄 FALLING BACK TO LOCAL FILE SYSTEM DATABASE (users.json)`);
    console.log(`  (You don't need to install anything! The app will work instantly)`);
    console.log(`  =========================================\n`);
    process.env.USE_JSON_DB = 'true';
  }
};

module.exports = connectDB;
