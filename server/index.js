const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDB } = require('./config/db');

const app = express();

initDB().catch(err => console.error('Failed to initialize database:', err));

console.log('Setting up CORS middleware...');
app.use(cors({
  origin: 'https://0138-102-89-33-228.ngrok-free.app',
  credentials: true
}));
console.log('CORS middleware set up successfully.');

console.log('Setting up JSON middleware...');
app.use(express.json());
console.log('JSON middleware set up successfully.');

console.log('Loading API routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('API routes loaded successfully.');

console.log('Setting up static file serving...');
app.use(express.static(path.join(__dirname, '../client/build')));
console.log('Static file serving set up successfully.');

// Temporarily disable the catch-all route to isolate the issue
// console.log('Setting up client routing...');
// app.get('*', (req, res) => {
//   console.log('Redirecting to login for path:', req.path);
//   res.redirect('/login');
// });
// console.log('Client routing set up successfully.');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`));