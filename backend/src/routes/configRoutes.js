const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const { 
  getAllConfigs, 
  getConfig, 
  updateConfig, 
  deleteConfig 
} = require('../controllers/configController');

// All config routes require admin authentication
router.use('/config', adminAuth);

// Get all configs
router.get('/config', getAllConfigs);

// Get specific config by key
router.get('/config/:key', getConfig);

// Update or create config
router.post('/config', updateConfig);

// Delete config
router.delete('/config/:key', deleteConfig);

module.exports = router; 