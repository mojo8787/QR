import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeTesting = () => {
  const [residentId, setResidentId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [expirationTime, setExpirationTime] = useState('60'); // Default 60 minutes
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQRCode = async () => {
    if (!residentId && !accessToken) {
      setError('Please enter either a Resident ID or Access Token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payload for QR code
      const payload = {
        type: residentId ? 'resident_id' : 'access_token',
        value: residentId || accessToken,
        exp: Date.now() + (parseInt(expirationTime) * 60 * 1000), // Convert minutes to milliseconds
        created: Date.now()
      };

      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
      });

      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      setError('Failed to generate QR code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear the other field when one is being filled
  useEffect(() => {
    if (residentId) setAccessToken('');
  }, [residentId]);

  useEffect(() => {
    if (accessToken) setResidentId('');
  }, [accessToken]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">QR Code Access Control Testing</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Resident ID
            <input
              type="text"
              value={residentId}
              onChange={(e) => setResidentId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter resident ID"
            />
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            OR Access Token
            <input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter access token"
            />
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Expiration Time (minutes)
            <input
              type="number"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="1"
            />
          </label>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          onClick={generateQRCode}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </div>
      
      {qrCodeDataUrl && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Generated QR Code</h2>
          <div className="flex justify-center mb-4">
            <img src={qrCodeDataUrl} alt="QR Code" className="border-2 border-gray-200 p-2 rounded-md" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Scan this code with a QR reader to test access control
          </p>
          <div className="flex space-x-2 justify-center">
            <a
              href={qrCodeDataUrl}
              download="access-qr-code.png"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
            >
              Download QR
            </a>
            <button
              onClick={() => setQrCodeDataUrl('')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeTesting; 