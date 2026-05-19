const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { loginAttemptsTotal, activeSessions } = require('../metrics');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const users = {
  alice: { username: 'alice', password: 'pass123' },
  bob: { username: 'bob', password: 'pass456' },
  admin: { username: 'admin', password: 'admin123' }
};

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  console.log('[auth] login attempt for:', username);
  console.log('[auth] body:', req.body);
  if (!username || !password) {
    loginAttemptsTotal.inc({ result: 'failure' });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = users[username];
  if (!user || user.password !== password) {
    loginAttemptsTotal.inc({ result: 'failure' });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
  loginAttemptsTotal.inc({ result: 'success' });
  activeSessions.inc();
  res.json({ token });
});

module.exports = router;
