import { Link } from 'react-router-dom';

const Dashboard = () => {
  const features = [
    {
      title: 'QR Code Testing',
      description: 'Generate and test QR codes for access control',
      link: '/qr-testing',
      icon: '📱'
    },
    {
      title: 'Push Notifications',
      description: 'Monitor and test push notification events',
      link: '/push-notifications',
      icon: '🔔'
    },
    {
      title: 'Device Simulation',
      description: 'Simulate device events and status changes',
      link: '/device-simulation',
      icon: '🚪'
    },
    {
      title: 'Config Assistant',
      description: 'Configure platform settings and test connections',
      link: '/config-assistant',
      icon: '⚙️'
    }
  ];

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Access Control Testing Platform
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link 
            to={feature.link} 
            key={feature.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
        <p className="text-gray-600 dark:text-gray-300">No recent activity to display. Start using the platform to see your activity here.</p>
      </div>
    </div>
  );
};

export default Dashboard; 