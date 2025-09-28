const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { sendBulkEmails } = require('./sendBulkEmails');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// API endpoint to receive email data
app.post('/send-bulk-emails', authenticateToken, upload.fields([
  { name: 'csv', maxCount: 1 },
  { name: 'attachments', maxCount: 10 }
]), async (req, res) => {
  try {
    // Get user credentials from database
    const [userRows] = await db.execute(
      'SELECT sender_email, app_password FROM users WHERE id = ?',
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    // Check if user has configured sender email and app password
    if (!user.sender_email || !user.app_password) {
      return res.status(400).json({ 
        message: 'Please configure your sender email and app password in your profile first' 
      });
    }

    const csvPath = req.files['csv'][0].path;
    const attachments = req.files['attachments'] ? req.files['attachments'].map(file => ({
      filename: file.originalname,
      path: file.path
    })) : [];
    const { subject, body, cc } = req.body;

    await sendBulkEmails(csvPath, subject, body, user.sender_email, user.app_password, cc, attachments);
    
    // Cleanup uploaded files
    fs.unlinkSync(csvPath);
    attachments.forEach(att => fs.unlinkSync(att.path));
    
    res.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: error.message });
  }
});

// Existing auth routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Profile routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});