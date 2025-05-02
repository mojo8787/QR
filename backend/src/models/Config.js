const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  description: { 
    type: String,
    trim: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedBy: { 
    type: String,
    trim: true
  }
}, {
  timestamps: true // Adds updatedAt and createdAt timestamps
});

// Static method to get a config value
ConfigSchema.statics.getValue = async function(key, defaultValue = null) {
  const config = await this.findOne({ key });
  return config ? config.value : defaultValue;
};

// Static method to set a config value
ConfigSchema.statics.setValue = async function(key, value, description = null, updatedBy = 'system') {
  return this.findOneAndUpdate(
    { key },
    { 
      value, 
      description: description || `Config for ${key}`,
      updatedBy,
      updatedAt: new Date()
    },
    { 
      new: true, 
      upsert: true 
    }
  );
};

module.exports = mongoose.model('Config', ConfigSchema); 