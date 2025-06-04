const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

// Register a user
router.post('/register', async (req, res) => {
   const { email, password } = req.body;
   try {
    const hashedPw = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPw])
    res.json('User registered successfully.')
   } catch (err) {
    res.status(400).json({ error: 'Email already exists'});
   }
})

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '10s'})
    const refresh = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d'})

    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: false, // change to true in production (requires HTTPS)
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token })
  } catch (err) {
    res.status(400).json({ error: 'error occured' })
  }  
})

router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccess = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '10s'})
    res.json({ accessToken: newAccess });
  });
})

router.post('/logout', (req, res) => {
  // clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  res.json('Logged out successfully')
})

module.exports = router;