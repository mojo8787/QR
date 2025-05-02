import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'

// Lazy-loaded components
const QRCodeTesting = lazy(() => import('./pages/QRCodeTesting'))
const PushNotifications = lazy(() => import('./pages/PushNotifications'))
const DeviceSimulation = lazy(() => import('./pages/DeviceSimulation'))
const ConfigAssistant = lazy(() => import('./pages/ConfigAssistant'))
const Settings = lazy(() => import('./pages/Settings'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/qr-testing" element={<QRCodeTesting />} />
              <Route path="/push-notifications" element={<PushNotifications />} />
              <Route path="/device-simulation" element={<DeviceSimulation />} />
              <Route path="/config-assistant" element={<ConfigAssistant />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
