const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDB, createTablesOrCollections } = require('../models/user');

let db;

router.use(async (req, res, next) => {
  if (!db) {
    db = await initDB();
    await createTablesOrCollections();
  }
  next();
});

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const dbType = process.env.DB_TYPE;
    let user;

    if (dbType === 'postgres') {
      const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (checkUser.rows.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        [email, hashedPassword, role]
      );
    } else if (dbType === 'mongodb') {
      const User = mongoose.model('User');
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        email,
        password: await bcrypt.hash(password, 10),
        role
      });
      await user.save();
    }

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbType = process.env.DB_TYPE;
    let user;

    if (dbType === 'postgres') {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      user = result.rows[0];
    } else if (dbType === 'mongodb') {
      const User = mongoose.model('User');
      user = await User.findOne({ email });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;