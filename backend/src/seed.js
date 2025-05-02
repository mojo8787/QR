require('dotenv').config();
const mongoose = require('mongoose');
const Config = require('./models/Config');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Initial configurations
    const defaultConfigs = [
      {
        key: 'push_endpoint',
        value: 'https://your-cloud-endpoint.com/api/push',
        description: 'Cloud endpoint for push notifications'
      },
      {
        key: 'secret_token',
        value: process.env.PUSH_SECRET_TOKEN || 'your-secret-token-here',
        description: 'Secret token for push authentication'
      },
      {
        key: 'email_notifications_enabled',
        value: true,
        description: 'Enable/disable email notifications'
      },
      {
        key: 'max_events_to_keep',
        value: 10000,
        description: 'Maximum number of events to keep in the database'
      }
    ];
    
    // Upsert all configs
    for (const config of defaultConfigs) {
      await Config.setValue(
        config.key,
        config.value,
        config.description,
        'seed-script'
      );
      console.log(`Config "${config.key}" initialized`);
    }
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedData().then(() => {
    console.log('Seed script completed');
    process.exit(0);
  }).catch(err => {
    console.error('Seed script failed:', err);
    process.exit(1);
  });
}

module.exports = seedData; 