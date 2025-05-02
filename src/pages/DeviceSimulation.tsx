import { useState } from 'react';

interface SimulatedDevice {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastEvent: string | null;
  lastEventTime: number | null;
}

const DeviceSimulation = () => {
  const [devices, setDevices] = useState<SimulatedDevice[]>([
    {
      id: 'device-1',
      name: 'Main Entrance',
      status: 'online',
      lastEvent: null,
      lastEventTime: null
    },
    {
      id: 'device-2',
      name: 'Side Door',
      status: 'online',
      lastEvent: null,
      lastEventTime: null
    },
    {
      id: 'device-3',
      name: 'Garage Entry',
      status: 'online',
      lastEvent: null,
      lastEventTime: null
    }
  ]);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  const [error, setError] = useState('');

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: device.status === 'online' ? 'offline' : 'online',
              lastEvent: `Status changed to ${device.status === 'online' ? 'offline' : 'online'}`,
              lastEventTime: Date.now()
            } 
          : device
      )
    );

    // Simulate email notification
    if (emailNotifications && emailAddress) {
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
    }
  };

  const triggerDoorOpen = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              lastEvent: 'Door opened',
              lastEventTime: Date.now()
            } 
          : device
      )
    );
  };

  const triggerAlarm = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              lastEvent: 'Alarm triggered',
              lastEventTime: Date.now()
            } 
          : device
      )
    );

    // Simulate email notification
    if (emailNotifications && emailAddress) {
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
    }
  };

  const toggleEmailNotifications = () => {
    if (!emailNotifications && !emailAddress) {
      setError('Please enter an email address first');
      return;
    }
    
    setError('');
    setEmailNotifications(!emailNotifications);
  };

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Device Status & Event Simulation</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Email Notifications</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Notification Email
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="your-email@example.com"
            />
          </label>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {notificationSent && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Notification email sent! (Simulated)
          </div>
        )}
        
        <button
          onClick={toggleEmailNotifications}
          className={`w-full font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
            emailNotifications 
              ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' 
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
          }`}
        >
          {emailNotifications ? 'Disable Email Notifications' : 'Enable Email Notifications'}
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Simulated Devices</h2>
        
        <div className="space-y-6">
          {devices.map((device) => (
            <div key={device.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">{device.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  device.status === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {device.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Last Event: {device.lastEvent || 'No events yet'}
                <br />
                Timestamp: {formatTimestamp(device.lastEventTime)}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleDeviceStatus(device.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  Toggle Status
                </button>
                
                <button
                  onClick={() => triggerDoorOpen(device.id)}
                  disabled={device.status === 'offline'}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                >
                  Trigger Door Open
                </button>
                
                <button
                  onClick={() => triggerAlarm(device.id)}
                  disabled={device.status === 'offline'}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
                >
                  Trigger Alarm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceSimulation; 