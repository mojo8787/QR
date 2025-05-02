const Config = require('../models/Config');

/**
 * Get all configurations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllConfigs = async (req, res) => {
  try {
    const configs = await Config.find({});
    res.status(200).json({
      success: true,
      data: configs
    });
  } catch (error) {
    console.error('Error retrieving configs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get a specific configuration by key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getConfig = async (req, res) => {
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'Config key is required'
      });
    }
    
    const config = await Config.findOne({ key });
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: `Config with key "${key}" not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error retrieving config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Update or create a configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateConfig = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Both key and value are required'
      });
    }

    // Use the static method from the model
    const config = await Config.setValue(
      key,
      value,
      description,
      req.user?.id || 'system'
    );
    
    res.status(200).json({
      success: true,
      data: config,
      message: `Config "${key}" updated successfully`
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Delete a configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteConfig = async (req, res) => {
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'Config key is required'
      });
    }
    
    const config = await Config.findOneAndDelete({ key });
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: `Config with key "${key}" not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: config,
      message: `Config "${key}" deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllConfigs,
  getConfig,
  updateConfig,
  deleteConfig
}; 