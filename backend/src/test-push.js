require('dotenv').config();
const axios = require('axios');

/**
 * Send a test push event to the backend
 */
const sendTestPushEvent = async () => {
  const apiUrl = `http://localhost:${process.env.PORT || 3000}/api/push-events`;
  const secretToken = process.env.PUSH_SECRET_TOKEN;
  
  // Sample event payload
  const payload = {
    deviceSn: `device-${Math.floor(Math.random() * 10) + 1}`,
    eventType: getRandomEventType(),
    eventTime: new Date().toISOString(),
    requestData: {
      action: 'openDoor',
      userId: `user-${Math.floor(Math.random() * 100) + 1}`,
      requestId: `req-${Date.now()}`
    },
    responseResult: {
      success: Math.random() > 0.3,
      message: 'Door command sent',
      timestamp: Date.now()
    }
  };
  
  try {
    console.log(`Sending test event to ${apiUrl}`);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Secret-Token': secretToken
      }
    });
    
    console.log('Response:', response.status, response.statusText);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error sending test event:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

/**
 * Get a random event type
 * @returns {string} Event type
 */
const getRandomEventType = () => {
  const eventTypes = [
    'door_opened',
    'door_open_failed',
    'device_offline',
    'device_online',
    'tamper_alarm',
    'unauthorized_access'
  ];
  
  return eventTypes[Math.floor(Math.random() * eventTypes.length)];
};

// Run the test if executed directly
if (require.main === module) {
  sendTestPushEvent().then(() => {
    console.log('Test completed');
  });
}

module.exports = { sendTestPushEvent }; 