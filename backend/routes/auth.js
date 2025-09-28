const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'Missing fields' });

  const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (user.length) return res.status(400).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (username, password, email, sender_email) VALUES (?, ?, ?, ?)",
    [username, hashed, email, email]  // pass email again for sender_email
  );
  
});

// Check if username exists
router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;
  
  if (!username || username.length < 3) {
    return res.json({ exists: false });
  }

  try {
    const [user] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    res.json({ exists: user.length > 0 });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ message: 'Error checking username' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (!user.length) return res.status(400).json({ message: 'Incorrect Username' });

  const valid = await bcrypt.compare(password, user[0].password);
  if (!valid) return res.status(400).json({ message: 'Incorrect Password' });

  const token = jwt.sign({ id: user[0].id, username: user[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/dashboard', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    res.json({ message: `Welcome, ${decoded.username}` });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/home', async (req, res) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const [user] = await db.query('SELECT id, username, email, sender_email, app_password, profile_photo_filename FROM users WHERE id = ?', [decoded.id]);
    if (!user.length) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

router.get('/profile/data', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const [user] = await db.query('SELECT id, username, email, profile_photo_filename FROM users WHERE username = ?', [decoded.username]);
    res.json({ user: user[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/profile/edit-profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const [user] = await db.query('SELECT id, username, email, profile_photo_filename FROM users WHERE username = ?', [decoded.username]);
    res.json({ user: user[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/register-ap', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const { sender_email, app_password } = req.body;
    if (!sender_email || !app_password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    await db.query(
      'UPDATE users SET sender_email = ?, app_password = ? WHERE id = ?',
      [sender_email, app_password, decoded.id]
    );
    res.json({ success: true, message: 'Sender email and app password saved' });
  } catch (error) {
    console.error('Error saving sender email/app password:', error);
    res.status(500).json({ success: false, message: 'Error saving data' });
  }
});

// Test endpoint to verify API is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working correctly' });
});

module.exports = router;