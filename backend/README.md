# Push Notification Backend

A RESTful API backend for handling push notifications from cloud IoT platforms.

## Features

- Webhook endpoint for receiving push events
- Secure token validation
- Event classification and storage
- Email notifications for status changes and alarms
- Real-time event broadcasting via Socket.IO
- Configuration management API
- Event history and statistics API

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (v4+)
- SMTP server for email notifications

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Copy the `.env.example` file to `.env` and customize the environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Seed the initial configuration:

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (`development`, `production`)
- `MONGODB_URI`: MongoDB connection string
- `PUSH_SECRET_TOKEN`: Secret token for push authentication
- `SMTP_*`: Email configuration variables
- `ADMIN_EMAIL`: Email for administrative notifications

## API Documentation

### Push Events

- `POST /api/push-events`: Receive push events from cloud
  - Headers:
    - `x-secret-token`: Authentication token (required)
  - Body: JSON payload with event data
    - `deviceSn`: Device serial number (required)
    - `eventType`: Type of event (required)
    - `eventTime`: ISO timestamp (optional, defaults to now)
    - `requestData`: Original request data (optional)
    - `responseResult`: Response result data (optional)

### Event History

- `GET /api/events`: Get event history with pagination and filtering
  - Headers:
    - `admin-token`: Admin authentication token (required)
  - Query Parameters:
    - `deviceId`: Filter by device ID
    - `category`: Filter by category
    - `status`: Filter by status
    - `startDate`: Filter by start date (ISO format)
    - `endDate`: Filter by end date (ISO format)
    - `limit`: Results per page (default: 50)
    - `page`: Page number (default: 1)
    - `sort`: Sort field (default: '-eventTime')

- `GET /api/events/stats`: Get event statistics
  - Headers:
    - `admin-token`: Admin authentication token (required)

### Configuration

- `GET /api/config`: Get all configurations
  - Headers:
    - `admin-token`: Admin authentication token (required)

- `GET /api/config/:key`: Get specific configuration
  - Headers:
    - `admin-token`: Admin authentication token (required)
  - Parameters:
    - `key`: Configuration key

- `POST /api/config`: Update or create configuration
  - Headers:
    - `admin-token`: Admin authentication token (required)
  - Body:
    - `key`: Configuration key (required)
    - `value`: Configuration value (required)
    - `description`: Description (optional)

- `DELETE /api/config/:key`: Delete configuration
  - Headers:
    - `admin-token`: Admin authentication token (required)
  - Parameters:
    - `key`: Configuration key

## WebSocket Events

- `newEvent`: Emitted when a new event is received
  - Payload:
    - `id`: Event ID
    - `deviceId`: Device ID
    - `eventType`: Event type
    - `category`: Event category
    - `status`: Event status
    - `timestamp`: Event timestamp

## License

ISC 