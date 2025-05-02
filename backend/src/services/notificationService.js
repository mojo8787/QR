const emailService = require('./emailService');
const Event = require('../models/Event');

/**
 * Handle failed events to notify admins
 * @param {Object} event - The event object
 * @returns {Boolean} Success status
 */
const handleFailedEvents = async (event) => {
  if (event.status !== 'failure') {
    return false;
  }
  
  console.log(`Failed event detected: ${event.eventType} for device ${event.deviceId}`);
  
  // Update the event to mark notification as sent
  await Event.findByIdAndUpdate(event._id, { notificationSent: true });
  
  // Send email based on event category
  if (event.category === 'access_failure') {
    return await emailService.sendStatusEmail(
      event.deviceId,
      'Access Failure',
      {
        eventType: event.eventType,
        time: event.eventTime,
        requestData: event.requestData,
        responseResult: event.responseResult
      }
    );
  }
  
  return false;
};

/**
 * Handle status change events to notify admins
 * @param {Object} event - The event object
 * @returns {Boolean} Success status
 */
const handleStatusChanges = async (event) => {
  if (event.category !== 'status') {
    return false;
  }
  
  console.log(`Status change detected: ${event.eventType} for device ${event.deviceId}`);
  
  // Update the event to mark notification as sent
  await Event.findByIdAndUpdate(event._id, { notificationSent: true });
  
  // Send email notification
  return await emailService.sendStatusEmail(
    event.deviceId,
    event.eventType,
    {
      time: event.eventTime,
      requestData: event.requestData,
      responseResult: event.responseResult
    }
  );
};

/**
 * Handle alarm events to notify admins
 * @param {Object} event - The event object
 * @returns {Boolean} Success status
 */
const handleAlarmEvents = async (event) => {
  if (event.category !== 'alarm') {
    return false;
  }
  
  console.log(`Alarm detected: ${event.eventType} for device ${event.deviceId}`);
  
  // Update the event to mark notification as sent
  await Event.findByIdAndUpdate(event._id, { notificationSent: true });
  
  // Send alarm email
  return await emailService.sendAlarmEmail(
    event.deviceId,
    event.eventType,
    {
      time: event.eventTime,
      requestData: event.requestData,
      responseResult: event.responseResult
    }
  );
};

/**
 * Process event to send appropriate notifications
 * @param {Object} event - The event object
 * @returns {Object} Result with notification statuses
 */
const processEventNotifications = async (event) => {
  const result = {
    failureHandled: false,
    statusHandled: false,
    alarmHandled: false
  };
  
  // Don't send duplicate notifications
  if (event.notificationSent) {
    return result;
  }
  
  // Process based on event type
  if (event.status === 'failure') {
    result.failureHandled = await handleFailedEvents(event);
  }
  
  if (event.category === 'status') {
    result.statusHandled = await handleStatusChanges(event);
  }
  
  if (event.category === 'alarm') {
    result.alarmHandled = await handleAlarmEvents(event);
  }
  
  return result;
};

module.exports = {
  handleFailedEvents,
  handleStatusChanges,
  handleAlarmEvents,
  processEventNotifications
}; 