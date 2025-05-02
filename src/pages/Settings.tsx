import { useState, useEffect } from 'react';

interface SettingsState {
  enableDarkMode: boolean;
  eventPollingInterval: number;
  saveLogsLocally: boolean;
  maxLogEntries: number;
  notificationSound: boolean;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : {
          enableDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
          eventPollingInterval: 5,
          saveLogsLocally: true,
          maxLogEntries: 100,
          notificationSound: true
        };
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  // Apply dark mode setting on mount and when it changes
  useEffect(() => {
    if (settings.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.enableDarkMode]);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };
  
  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const resetSettings = () => {
    const defaultSettings = {
      enableDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      eventPollingInterval: 5,
      saveLogsLocally: true,
      maxLogEntries: 100,
      notificationSound: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    setIsResetModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const clearAllData = () => {
    // Clear all app data from localStorage
    localStorage.removeItem('appSettings');
    localStorage.removeItem('webhookUrl');
    localStorage.removeItem('secretToken');
    localStorage.removeItem('pushAddress');
    localStorage.removeItem('headerToken');
    localStorage.removeItem('testPayload');
    
    // Reset to default settings
    resetSettings();
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">App Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">General Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300 mr-3">Dark Mode</span>
              <div className="relative">
                <input
                  type="checkbox"
                  name="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`block w-14 h-7 rounded-full ${settings.enableDarkMode ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${settings.enableDarkMode ? 'transform translate-x-7' : ''}`}></div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300 mr-3">Play Notification Sounds</span>
              <div className="relative">
                <input
                  type="checkbox"
                  name="notificationSound"
                  checked={settings.notificationSound}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`block w-14 h-7 rounded-full ${settings.notificationSound ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${settings.notificationSound ? 'transform translate-x-7' : ''}`}></div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300 mr-3">Save Logs Locally</span>
              <div className="relative">
                <input
                  type="checkbox"
                  name="saveLogsLocally"
                  checked={settings.saveLogsLocally}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`block w-14 h-7 rounded-full ${settings.saveLogsLocally ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${settings.saveLogsLocally ? 'transform translate-x-7' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Advanced Settings</h2>
        
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Event Polling Interval (seconds)
              <input
                type="number"
                name="eventPollingInterval"
                value={settings.eventPollingInterval}
                onChange={handleChange}
                min="1"
                max="60"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </label>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Maximum Log Entries
              <input
                type="number"
                name="maxLogEntries"
                value={settings.maxLogEntries}
                onChange={handleChange}
                min="10"
                max="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </label>
          </div>
        </div>
      </div>
      
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Settings saved successfully!
        </div>
      )}
      
      <div className="flex space-x-2 mb-6">
        <button
          onClick={saveSettings}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Save Settings
        </button>
        
        <button
          onClick={() => setIsResetModalOpen(true)}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
        >
          Reset to Default
        </button>
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
          This action will permanently delete all your saved data and settings.
        </p>
        <button
          onClick={clearAllData}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          Clear All Data
        </button>
      </div>
      
      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Reset Settings</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to reset all settings to their default values?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetSettings}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 