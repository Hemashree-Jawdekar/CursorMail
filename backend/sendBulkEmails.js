const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to replace {{placeholders}} with values from the recipient object
function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
}

module.exports.sendBulkEmails = async function (csvFilePath, subjectTemplate, bodyTemplate, senderEmail, appPassword, cc, attachments) {
  const recipients = [];

  // 1. Read CSV and collect recipients
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.Email && row.Name) {
          recipients.push({
            name: row.Name,
            email: row.Email,
          });
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (recipients.length === 0) {
    throw new Error('No valid recipients found in CSV.');
  }

  // 2. Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: appPassword
    }
  });

  // 3. Send emails
  for (const recipient of recipients) {
    const personalizedSubject = renderTemplate(subjectTemplate, recipient);
    const personalizedBody = renderTemplate(bodyTemplate, recipient);

    const mailOptions = {
      from: `"ElevateMail" <${senderEmail}>`,
      to: recipient.email,
      subject: personalizedSubject,
      text: personalizedBody,
      cc: cc ? cc.split(',').map(addr => addr.trim()) : undefined,
      attachments: attachments && attachments.length > 0 ? attachments : undefined
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${recipient.email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${recipient.email}: ${error.message}`);
    }
  }
}; 