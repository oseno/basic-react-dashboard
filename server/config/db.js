const mongoose = require('mongoose');
require('dotenv').config();

const initDB = async () => {
  const uri = process.env.MONGODB_URI;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB at', new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = { initDB };