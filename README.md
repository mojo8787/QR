# Access Control Testing Platform

A progressive web application for testing and simulating access control systems, device status, and event notifications.

## Features

- QR Code Access Control Testing
- Push Notification Event Logging
- Device Status & Event Simulation
- Platform Configuration Assistant
- PWA Support

## Project Implementation Progress

### Setup
- [x] Created project documentation
- [x] Setup project structure
- [x] Initialize frontend application

### QR Code Access Control Testing
- [x] Generate QR code from resident ID or access token
- [x] Set expiration time for QR codes
- [ ] Test QR scan to trigger door open
- [ ] Simulate invalid QR access

### Push Notification Event Logging
- [x] Input webhook URL for receiving push events
- [x] Verify push request secret token header
- [x] Live display of incoming push events
- [x] Export logs as CSV

### Device Status & Event Simulation
- [x] Simulate device online/offline events
- [x] Manually trigger open door event
- [x] Simulate device alarm or tamper event
- [x] Receive device status email alerts

### Platform Configuration Assistant
- [x] Configure and save Push Address
- [x] Set and verify custom header token
- [x] Test push by sending fake payload
- [x] View request/response format for debug

### UI/UX & PWA Functionalities
- [x] Install the app as PWA
- [ ] Scan QR directly from mobile
- [x] Dashboard for live status and logs
- [x] Editable settings page for tokens/URLs

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd access-control-testing

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Technologies Used

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- QR Code generation
- LocalStorage for persistence
- PWA capabilities for offline use

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
