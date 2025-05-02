import { useState, useEffect } from 'react';

interface PushEvent {
  id: string;
  type: string;
  timestamp: number;
  data: Record<string, any>;
}

const PushNotifications = () => {
  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('webhookUrl') || '');
  const [secretToken, setSecretToken] = useState(localStorage.getItem('secretToken') || '');
  const [events, setEvents] = useState<PushEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  // Save webhook URL and secret token to localStorage when changed
  useEffect(() => {
    localStorage.setItem('webhookUrl', webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem('secretToken', secretToken);
  }, [secretToken]);

  const connectWebhook = () => {
    if (!webhookUrl) {
      setError('Please enter a webhook URL');
      return;
    }

    setError('');
    setIsConnected(true);
    
    // In a real app, we would establish a WebSocket connection or similar
    // For now, we'll just simulate receiving events
    simulateEvents();
  };

  const disconnectWebhook = () => {
    setIsConnected(false);
    setError('');
  };

  const simulateEvents = () => {
    // This would be replaced with actual webhook/websocket event handling
    const eventTypes = ['door_opened', 'access_denied', 'device_online', 'device_offline'];
    
    const interval = setInterval(() => {
      if (!isConnected) {
        clearInterval(interval);
        return;
      }

      const newEvent: PushEvent = {
        id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        timestamp: Date.now(),
        data: {
          deviceId: `device-${Math.floor(Math.random() * 10) + 1}`,
          userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 100) + 1}` : null,
          success: Math.random() > 0.3
        }
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 100)); // Keep max 100 events
    }, 5000); // Simulate a new event every 5 seconds

    return () => clearInterval(interval);
  };

  const exportToCsv = () => {
    if (events.length === 0) {
      setError('No events to export');
      return;
    }

    // Create CSV content
    const headers = ['ID', 'Type', 'Timestamp', 'Device ID', 'User ID', 'Success'];
    const csvRows = [headers.join(',')];

    events.forEach(event => {
      const row = [
        event.id,
        event.type,
        new Date(event.timestamp).toISOString(),
        event.data.deviceId,
        event.data.userId || 'N/A',
        event.data.success ? 'Yes' : 'No'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `push-events-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventClass = (type: string) => {
    switch (type) {
      case 'door_opened':
        return 'bg-green-100 text-green-800';
      case 'access_denied':
        return 'bg-red-100 text-red-800';
      case 'device_online':
        return 'bg-blue-100 text-blue-800';
      case 'device_offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Push Notification Event Logging</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Webhook URL
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isConnected}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://your-webhook-endpoint.com/events"
            />
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Secret Token
            <input
              type="text"
              value={secretToken}
              onChange={(e) => setSecretToken(e.target.value)}
              disabled={isConnected}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="your-secret-token"
            />
          </label>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex space-x-2">
          {!isConnected ? (
            <button
              onClick={connectWebhook}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Connect Webhook
            </button>
          ) : (
            <button
              onClick={disconnectWebhook}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
              Disconnect Webhook
            </button>
          )}
          
          <button
            onClick={exportToCsv}
            disabled={events.length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          >
            Export to CSV
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Live Event Feed</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        {events.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-10">
            {isConnected ? 'Waiting for events...' : 'Connect to webhook to start receiving events'}
          </p>
        ) : (
          <div className="overflow-y-auto max-h-96">
            {events.map((event) => (
              <div key={event.id} className="border-b border-gray-200 dark:border-gray-700 py-3">
                <div className="flex justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEventClass(event.type)}`}>
                    {event.type}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">Device: {event.data.deviceId}</p>
                  {event.data.userId && (
                    <p className="text-gray-700 dark:text-gray-300">User: {event.data.userId}</p>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">
                    Status: {event.data.success ? 'Success' : 'Failed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotifications; 