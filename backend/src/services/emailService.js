const nodemailer = require('nodemailer');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Test the connection
const verifyConnection = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Email service: Verification skipped in development mode');
    return true;
  }
  
  try {
    await transporter.verify();
    console.log('Email service: Connection verified');
    return true;
  } catch (error) {
    console.error('Email service: Connection failed', error);
    return false;
  }
};

/**
 * Send status change email notification
 * @param {string} deviceId - Device identifier
 * @param {string} eventType - Type of event
 * @param {Object} details - Additional details to include in the email
 */
const sendStatusEmail = async (deviceId, eventType, details = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.error('Email service: No admin email configured');
    return false;
  }
  
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'notifications@app.com',
      to: adminEmail,
      subject: `Device Status Alert: ${deviceId} - ${eventType}`,
      html: `
        <h1>Device Status Change Detected</h1>
        <p><strong>Device ID:</strong> ${deviceId}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Details:</strong></p>
        <pre>${JSON.stringify(details, null, 2)}</pre>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

/**
 * Send alarm notification email
 * @param {string} deviceId - Device identifier
 * @param {string} alarmType - Type of alarm
 * @param {Object} details - Additional details to include in the email
 */
const sendAlarmEmail = async (deviceId, alarmType, details = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.error('Email service: No admin email configured');
    return false;
  }
  
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'notifications@app.com',
      to: adminEmail,
      subject: `URGENT: Alarm Alert for Device ${deviceId}`,
      html: `
        <h1 style="color: red;">ALARM DETECTED</h1>
        <p><strong>Device ID:</strong> ${deviceId}</p>
        <p><strong>Alarm Type:</strong> ${alarmType}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Details:</strong></p>
        <pre>${JSON.stringify(details, null, 2)}</pre>
        <p>Please take immediate action.</p>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Alarm email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send alarm email:', error);
    return false;
  }
};

module.exports = {
  verifyConnection,
  sendStatusEmail,
  sendAlarmEmail
}; 