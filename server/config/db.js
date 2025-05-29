const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

let db;

const initDB = async () => {
  const dbType = process.env.DB_TYPE;

  if (dbType === 'postgres') {
    db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    // Check if database exists, create if not
    const client = await db.connect();
    try {
      await client.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      await client.query(`\\c ${process.env.DB_NAME}`);
    } catch (err) {
      console.log('Database already exists or creation failed:', err);
    } finally {
      client.release();
    }
  } else if (dbType === 'mongodb') {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = mongoose.connection;
    db.once('open', () => console.log('MongoDB connected'));
  }

  return db;
};

module.exports = { initDB };