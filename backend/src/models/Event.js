const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  deviceId: { 
    type: String, 
    required: true, 
    index: true,
    trim: true
  },
  eventType: { 
    type: String, 
    required: true, 
    index: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['access', 'access_failure', 'status', 'alarm', 'security', 'other'],
    index: true
  },
  eventTime: { 
    type: Date, 
    required: true, 
    default: Date.now, 
    index: true 
  },
  requestData: { 
    type: mongoose.Schema.Types.Mixed 
  },
  responseResult: { 
    type: mongoose.Schema.Types.Mixed 
  },
  status: { 
    type: String, 
    enum: ['success', 'failure'], 
    required: true,
    index: true
  },
  processingTime: { 
    type: Number  // in milliseconds
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}, {
  timestamps: true // Adds updatedAt and createdAt timestamps
});

// Add text index for search
EventSchema.index({ 
  deviceId: 'text', 
  eventType: 'text'
});

// Method to classify events
EventSchema.statics.classifyEvent = function(eventType) {
  // Map of event types to categories
  const categoryMap = {
    'door_opened': 'access',
    'door_open_failed': 'access_failure',
    'device_offline': 'status',
    'device_online': 'status',
    'tamper_alarm': 'alarm',
    'unauthorized_access': 'security',
  };
  
  return categoryMap[eventType] || 'other';
};

module.exports = mongoose.model('Event', EventSchema); 