import { useState, useEffect } from 'react';
import axios from 'axios';

interface RequestResponse {
  status: number;
  success: boolean;
  timestamp: number;
  requestPayload: Record<string, any>;
  responseData?: Record<string, any>;
  errorMessage?: string;
}

// Add event type options for quick selection
const EVENT_TYPES = [
  'door_opened',
  'door_open_failed',
  'device_online',
  'device_offline',
  'tamper_alarm',
  'unauthorized_access'
];

const ConfigAssistant = () => {
  const [backendUrl, setBackendUrl] = useState(localStorage.getItem('backendUrl') || 'http://localhost:3000');
  const [pushAddress, setPushAddress] = useState(localStorage.getItem('pushAddress') || '');
  const [headerToken, setHeaderToken] = useState(localStorage.getItem('headerToken') || '');
  const [testPayload, setTestPayload] = useState(
    localStorage.getItem('testPayload') || 
    JSON.stringify({
      deviceSn: 'test-device-1',
      eventType: 'door_opened',
      eventTime: new Date().toISOString(),
      requestData: {
        action: 'openDoor',
        userId: 'test-user-123',
        requestId: `req-${Date.now()}`
      },
      responseResult: {
        success: true,
        message: 'Door command sent',
        timestamp: Date.now()
      }
    }, null, 2)
  );
  const [requestHistory, setRequestHistory] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('config'); // 'config' or 'templates'
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check backend connection status on load
  useEffect(() => {
    checkConnection();
  }, [backendUrl]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      await axios.get(`${backendUrl}/api/health`);
      setConnectionStatus('connected');
    } catch (err) {
      setConnectionStatus('disconnected');
    }
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem('backendUrl', backendUrl);
      localStorage.setItem('pushAddress', pushAddress);
      localStorage.setItem('headerToken', headerToken);
      localStorage.setItem('testPayload', testPayload);
      
      setSaveSuccess(true);
      setError('');
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save configuration');
      console.error(err);
    }
  };

  const applyTemplate = (eventType: string) => {
    try {
      // Parse current payload
      const payload = JSON.parse(testPayload);
      
      // Update the event type
      payload.eventType = eventType;
      
      // Update timestamp
      payload.eventTime = new Date().toISOString();
      
      // Update requestId and timestamp in nested objects
      if (payload.requestData) {
        payload.requestData.requestId = `req-${Date.now()}`;
      }
      
      if (payload.responseResult) {
        payload.responseResult.timestamp = Date.now();
        
        // For failure events, set success to false
        if (eventType.includes('fail') || eventType === 'unauthorized_access') {
          payload.responseResult.success = false;
        } else {
          payload.responseResult.success = true;
        }
      }
      
      // Update the payload
      setTestPayload(JSON.stringify(payload, null, 2));
    } catch (err) {
      setError('Failed to apply template. Invalid JSON payload.');
    }
  };

  const testPushEndpoint = async () => {
    if (!pushAddress) {
      setError('Please enter a Push Address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validate JSON
      const payload = JSON.parse(testPayload);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (headerToken) {
        headers['X-Secret-Token'] = headerToken;
      }

      // Make request
      const start = Date.now();
      const response = await axios.post(pushAddress, payload, { headers });
      
      // Add to history
      const requestResponse: RequestResponse = {
        status: response.status,
        success: true,
        timestamp: start,
        requestPayload: payload,
        responseData: response.data
      };
      
      setRequestHistory(prev => [requestResponse, ...prev]);
    } catch (err: any) {
      console.error('Push test error:', err);
      
      // Add failed request to history
      const requestResponse: RequestResponse = {
        status: err.response?.status || 0,
        success: false,
        timestamp: Date.now(),
        requestPayload: JSON.parse(testPayload),
        errorMessage: err.message
      };
      
      setRequestHistory(prev => [requestResponse, ...prev]);
      setError(`Failed to test push: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testBackendEndpoint = async () => {
    if (!backendUrl) {
      setError('Please enter a Backend URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validate JSON
      const payload = JSON.parse(testPayload);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (headerToken) {
        headers['X-Secret-Token'] = headerToken;
      }

      // Make request to our backend's push-events endpoint
      const endpoint = `${backendUrl}/api/push-events`;
      const start = Date.now();
      const response = await axios.post(endpoint, payload, { headers });
      
      // Add to history
      const requestResponse: RequestResponse = {
        status: response.status,
        success: true,
        timestamp: start,
        requestPayload: payload,
        responseData: response.data
      };
      
      setRequestHistory(prev => [requestResponse, ...prev]);
    } catch (err: any) {
      console.error('Backend test error:', err);
      
      // Add failed request to history
      const requestResponse: RequestResponse = {
        status: err.response?.status || 0,
        success: false,
        timestamp: Date.now(),
        requestPayload: JSON.parse(testPayload),
        errorMessage: err.message
      };
      
      setRequestHistory(prev => [requestResponse, ...prev]);
      setError(`Failed to test backend: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setRequestHistory([]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Platform Configuration Assistant</h1>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Backend:</span>
          {connectionStatus === 'checking' && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
              Checking...
            </span>
          )}
          {connectionStatus === 'connected' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Connected
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              Disconnected
            </span>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'config'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('config')}
          >
            Configuration
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('templates')}
          >
            Event Templates
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'config' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Backend URL
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        value={backendUrl}
                        onChange={(e) => setBackendUrl(e.target.value)}
                        className="block w-full rounded-md border-gray-300 pl-3 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="http://localhost:3000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button 
                          onClick={checkConnection}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Check
                        </button>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Push Address
                    <input
                      type="text"
                      value={pushAddress}
                      onChange={(e) => setPushAddress(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://your-webhook-endpoint.com/events"
                    />
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    X-Secret-Token
                    <input
                      type="text"
                      value={headerToken}
                      onChange={(e) => setHeaderToken(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="your-secret-token"
                    />
                  </label>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={saveConfiguration}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Test Payload (JSON)
                    <textarea
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      rows={10}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                    />
                  </label>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={testPushEndpoint}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Testing...
                      </>
                    ) : 'Test Custom Endpoint'}
                  </button>
                  
                  <button
                    onClick={testBackendEndpoint}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Testing...
                      </>
                    ) : 'Test Backend API'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'templates' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Event Templates</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click on an event type to apply it to your test payload. This will update the eventType in your payload while preserving other data.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {EVENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => applyTemplate(type)}
                    className={`p-3 rounded-md text-sm border transition-colors ${
                      type.includes('fail') || type.includes('alarm') || type === 'unauthorized_access'
                        ? 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                        : 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                    }`}
                  >
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to Configuration
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center border border-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          {saveSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center border border-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Configuration saved successfully!
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request History</h2>
          
          {requestHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear History
            </button>
          )}
        </div>
        
        <div className="p-6">
          {requestHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No requests yet. Test your endpoints to see the results here.</p>
              <button 
                onClick={() => setActiveTab('config')}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Go to test configuration
              </button>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[500px]">
              {requestHistory.map((request, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  request.success 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      {request.success ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.success 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-800/50 dark:text-red-300'
                      }`}>
                        {request.success ? 'Success' : 'Failed'} - Status: {request.status}
                      </span>
                      
                      {request.requestPayload.eventType && (
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs">
                          {request.requestPayload.eventType}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(request.timestamp)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Request Payload:
                      </h4>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(request.requestPayload, null, 2)}
                      </pre>
                    </div>
                    
                    {request.success && request.responseData && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Response:
                        </h4>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(request.responseData, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {!request.success && request.errorMessage && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Error:
                        </h4>
                        <pre className="bg-red-50 dark:bg-gray-900 p-3 rounded text-xs text-red-700 dark:text-red-400 overflow-x-auto">
                          {request.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigAssistant; 