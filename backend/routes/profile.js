const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-photos';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Upload profile photo
router.post('/upload-photo', authenticateToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const filePath = req.file.path;
    const fileName = req.file.filename;

    // Update database with file path
    await db.query(
      'UPDATE users SET profile_photo_path = ?, profile_photo_filename = ? WHERE id = ?',
      [filePath, fileName, userId]
    );

    res.json({
      message: 'Profile photo uploaded successfully',
      filename: fileName,
      path: filePath
    });

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Error uploading profile photo' });
  }
});

// Get profile photo
router.get('/photo/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [user] = await db.query(
      'SELECT profile_photo_path, profile_photo_filename FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user[0];
    
    if (!userData.profile_photo_path || !fs.existsSync(userData.profile_photo_path)) {
      return res.status(404).json({ message: 'Profile photo not found' });
    }

    // Send the image file
    res.sendFile(path.resolve(userData.profile_photo_path));

  } catch (error) {
    console.error('Error getting profile photo:', error);
    res.status(500).json({ message: 'Error retrieving profile photo' });
  }
});

// Delete profile photo
router.delete('/photo', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current photo path
    const [user] = await db.query(
      'SELECT profile_photo_path FROM users WHERE id = ?',
      [userId]
    );

    if (user.length > 0 && user[0].profile_photo_path) {
      // Delete file from server
      if (fs.existsSync(user[0].profile_photo_path)) {
        fs.unlinkSync(user[0].profile_photo_path);
      }
    }

    // Update database
    await db.query(
      'UPDATE users SET profile_photo_path = NULL, profile_photo_filename = NULL WHERE id = ?',
      [userId]
    );

    res.json({ message: 'Profile photo deleted successfully' });

  } catch (error) {
    console.error('Error deleting profile photo:', error);
    res.status(500).json({ message: 'Error deleting profile photo' });
  }
});

// Update user profile information (username, sender_email, app_password)
router.put('/edit-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, sender_email, app_password } = req.body;

    // Validate required fields
    if (!username || !sender_email || !app_password) {
      return res.status(400).json({ message: 'Username, sender email, and app password are required' });
    }

    // Check if username is already taken by another user
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [username, userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Update user information
    await db.query(
      'UPDATE users SET username = ?, sender_email = ?, app_password = ? WHERE id = ?',
      [username, sender_email, app_password, userId]
    );

    res.json({ 
      message: 'Profile updated successfully',
      user: { username, sender_email, app_password }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get current user's password
    const [user] = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user[0].password);
    
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Get user profile data for editing
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching data for user ID:', userId);
    
    const [user] = await db.query(
      'SELECT id, username, email, sender_email, app_password, profile_photo_filename FROM users WHERE id = ?',
      [userId]
    );

    console.log('Database query result:', user);

    if (user.length === 0) {
      console.log('No user found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user[0];
    console.log('User data found:', userData);
    
    // Add profile photo URL if available
    if (userData.profile_photo_filename) {
      userData.profile_photo_url = `/api/profile/photo/${userData.id}`;
    }

    res.json({ user: userData });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

module.exports = router; 