const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the environment variable
    await mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected');
  } catch (err) {
    // Log any errors that occur during the connection attempt
    console.error('MongoDB connection error:', err.message);
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
