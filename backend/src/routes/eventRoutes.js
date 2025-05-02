const express = require('express');
const router = express.Router();
const { validateSecretToken, adminAuth } = require('../middleware/auth');
const { processEvent, getEvents, getEventStats } = require('../controllers/eventController');

// Public routes (for testing only, in production you would secure these)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Push events endpoint (requires secret token)
router.post('/push-events', validateSecretToken, processEvent);

// Verify access endpoint for QR code verification
router.post('/verify-access', validateSecretToken, (req, res) => {
  const { code, deviceId, timestamp } = req.body;
  
  // Log the verification attempt
  console.log('Access verification attempt:', { deviceId, timestamp, hasCode: !!code });
  
  // In a real implementation, you would validate the QR code
  // For this demo, we'll just check if code exists
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Missing code',
      timestamp: new Date()
    });
  }
  
  // Emit the verification event to connected clients
  if (req.io) {
    req.io.emit('accessVerification', {
      deviceId,
      timestamp: new Date(),
      success: true
    });
  }
  
  // Return success
  res.status(200).json({
    success: true,
    verified: true,
    message: 'Access granted',
    timestamp: new Date()
  });
});

// Admin routes (requires admin authentication)
router.get('/events', adminAuth, getEvents);
router.get('/events/stats', adminAuth, getEventStats);

module.exports = router; 