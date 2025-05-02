# Access Control System Deployment Guide

## Current Configuration

### MongoDB Atlas Cloud Database
- Connected to MongoDB Atlas cluster: `moe2.pbhao4j.mongodb.net`
- Username: `motasemyouniss`
- Connection string: `mongodb+srv://motasemyouniss:***@moe2.pbhao4j.mongodb.net/?retryWrites=true&w=majority&appName=moe2`

### Smart Community Cloud Platform Integration
- UUID for integration: `78257432-e368-47e0-912c-5f8c159ac0fe`
- Real-time event push address: `http://localhost:3000/api/push-events`
- Device status push address: `http://localhost:3000/api/push-events`
- Online verification opening address: `http://localhost:3000/api/verify-access`
- Device call push address: `http://localhost:3000/api/push-events`
- Secret Token Name: `X-Secret-Token`
- Secret Token Value: `your-secret-token-here`
- QR Code Password: `Qr2Ac$Control#24`

### Local Development Setup
- Backend running on: `http://localhost:3000`
- Frontend running on: `http://localhost:5173` (may vary: 5174, 5175)

## Hosting on a Public Server

### Prerequisites
1. A hosting provider account (Heroku, Render, DigitalOcean, AWS, etc.)
2. MongoDB Atlas account (already configured)
3. Optional: A custom domain name

### Backend Deployment (Node.js/Express)

#### Option 1: Render.com
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure as:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Set environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://motasemyouniss:***@moe2.pbhao4j.mongodb.net/?retryWrites=true&w=majority&appName=moe2
   PUSH_SECRET_TOKEN=your-secret-token-here
   ADMIN_TOKEN=admin-secret-token
   FRONTEND_URL=https://your-frontend-url.com
   ```
5. Deploy the service

#### Option 2: Heroku
1. Install Heroku CLI: `npm install -g heroku`
2. Login to Heroku: `heroku login`
3. Create a new app: `heroku create your-app-name`
4. Add Procfile to project root:
   ```
   web: node backend/src/server.js
   ```
5. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=mongodb+srv://motasemyouniss:***@moe2.pbhao4j.mongodb.net/?retryWrites=true&w=majority&appName=moe2
   heroku config:set PUSH_SECRET_TOKEN=your-secret-token-here
   heroku config:set ADMIN_TOKEN=admin-secret-token
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   ```
6. Deploy: `git push heroku main`

### Frontend Deployment (React/Vite)

#### Option 1: Netlify
1. Build your project: `npm run build`
2. Create a netlify.toml file:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

#### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Update Configuration After Deployment

Once deployed, update the Smart Community Cloud Platform with the new URLs:

1. Real-time event push address: `https://your-backend-url.com/api/push-events`
2. Device status push address: `https://your-backend-url.com/api/push-events`
3. Online verification opening address: `https://your-backend-url.com/api/verify-access`
4. Device call push address: `https://your-backend-url.com/api/push-events`

### Security Considerations for Production

1. Generate a proper random secret token:
   ```javascript
   const crypto = require('crypto');
   const token = crypto.randomBytes(32).toString('hex');
   console.log(token);
   ```

2. Set up HTTPS with SSL certificate (automatic with most hosting providers)

3. Implement rate limiting for API endpoints:
   ```javascript
   const rateLimit = require("express-rate-limit");
   
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use("/api/", apiLimiter);
   ```

4. Add CORS restrictions in production:
   ```javascript
   const corsOptions = {
     origin: process.env.FRONTEND_URL,
     methods: ['GET', 'POST'],
     credentials: true
   };
   
   app.use(cors(corsOptions));
   ``` 