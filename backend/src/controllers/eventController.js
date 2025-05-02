const Event = require('../models/Event');
const notificationService = require('../services/notificationService');

/**
 * Process push events from cloud
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processEvent = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Extract fields from payload (adjust based on your actual payload format)
    const { 
      deviceSn, 
      eventType, 
      eventTime = new Date(), 
      requestData = {}, 
      responseResult = {} 
    } = req.body;
    
    // Validate required fields
    if (!deviceSn || !eventType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: deviceSn and eventType are required',
        timestamp: new Date()
      });
    }
    
    // Determine event category and status
    const category = Event.classifyEvent(eventType);
    const status = responseResult.success === false ? 'failure' : 'success';
    
    // Create event record
    const event = new Event({
      deviceId: deviceSn,
      eventType,
      category,
      eventTime: new Date(eventTime),
      requestData,
      responseResult,
      status,
      processingTime: Date.now() - startTime
    });
    
    // Save the event
    await event.save();
    
    // Process notifications asynchronously
    notificationService.processEventNotifications(event)
      .then(notificationResult => {
        console.log('Notification processing completed:', notificationResult);
      })
      .catch(err => {
        console.error('Error processing notifications:', err);
      });
    
    // Emit the event to all connected clients
    if (req.io) {
      req.io.emit('newEvent', {
        id: event._id,
        deviceId: event.deviceId,
        eventType: event.eventType,
        category: event.category,
        status: event.status,
        timestamp: event.eventTime
      });
    }
    
    // Send success response
    res.status(200).json({
      success: true,
      processed: true,
      eventId: event._id,
      timestamp: new Date(),
      processingTime: Date.now() - startTime,
      message: 'Event successfully processed'
    });
  } catch (error) {
    console.error('Error processing event:', error);
    
    // Send error response
    res.status(500).json({
      success: false,
      processed: false,
      error: error.message,
      timestamp: new Date(),
      processingTime: Date.now() - startTime,
      canRetry: true,
      retryAfter: 5 // seconds
    });
  }
};

/**
 * Get recent events with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEvents = async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const { 
      deviceId,
      category,
      status,
      startDate,
      endDate,
      limit = 50,
      page = 1,
      sort = '-eventTime'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (deviceId) filter.deviceId = deviceId;
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    // Date range filter
    if (startDate || endDate) {
      filter.eventTime = {};
      if (startDate) filter.eventTime.$gte = new Date(startDate);
      if (endDate) filter.eventTime.$lte = new Date(endDate);
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count
    const total = await Event.countDocuments(filter);
    
    // Send response
    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get event statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEventStats = async (req, res) => {
  try {
    // Get count by category
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get count by status
    const statusStats = await Event.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get recent event counts by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Event.aggregate([
      { 
        $match: { 
          eventTime: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$eventTime' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format into a response
    res.status(200).json({
      success: true,
      data: {
        categoryStats: categoryStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        statusStats: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error retrieving event stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  processEvent,
  getEvents,
  getEventStats
}; 