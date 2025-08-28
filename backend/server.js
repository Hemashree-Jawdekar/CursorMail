const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const { sendBulkEmails } = require('./sendBulkEmails');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// API endpoint to receive email data
app.post('/send-bulk-emails', upload.fields([
  { name: 'csv', maxCount: 1 },
  { name: 'attachments', maxCount: 10 }
]), async (req, res) => {
  const csvPath = req.files['csv'][0].path;
  const attachments = req.files['attachments'] ? req.files['attachments'].map(file => ({
    filename: file.originalname,
    path: file.path
  })) : [];
  const { subject, body, email_id, app_password, cc } = req.body;

  try {
    await sendBulkEmails(csvPath, subject, body, email_id, app_password, cc, attachments);
    fs.unlinkSync(csvPath); // Cleanup uploaded file
    attachments.forEach(att => fs.unlinkSync(att.path)); // Cleanup attachments
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