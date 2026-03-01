const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const users = {}; // In-memory for now (replace with DB)

// Hash password
const hashPassword = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');

// Register
router.post('/register', express.json(), (req, res) => {
  const { email, password, subscribe } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (users[email]) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  users[email] = {
    password: hashPassword(password),
    created: new Date(),
    plan: subscribe ? 'premium' : 'free'
  };
  
  res.json({ success: true, message: 'Welcome to Prem Plays!', email });
});

// Login
router.post('/login', express.json(), (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  const user = users[email];
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Simple token (replace with JWT)
  const token = crypto.randomBytes(32).toString('hex');
  user.token = token;
  
  res.json({ success: true, token, plan: user.plan });
});

// Get user (protected)
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  for (const [email, user] of Object.entries(users)) {
    if (user.token === token) {
      return res.json({ email, plan: user.plan });
    }
  }
  
  res.status(401).json({ error: 'Unauthorized' });
});

module.exports = router;
