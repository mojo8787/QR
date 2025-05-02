#!/bin/bash
# Deployment script for QR Access Control application on EC2
# Run this script on your EC2 instance

# Exit on error
set -e

echo "===== Starting deployment of QR Access Control System ====="

# Update system
echo "===== Updating system packages ====="
sudo yum update -y

# Install Node.js
echo "===== Installing Node.js ====="
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
node --version
npm --version

# Install Git and Nginx
echo "===== Installing Git and Nginx ====="
sudo yum install -y git nginx
git --version
nginx -v

# Install PM2
echo "===== Installing PM2 ====="
sudo npm install -g pm2
pm2 --version

# Clone repository
echo "===== Cloning repository ====="
git clone https://github.com/mojo8787/QR.git
cd QR

# Set up backend
echo "===== Setting up backend ====="
cd backend
npm install

# Create .env file
echo "===== Creating backend .env file ====="
cat > .env << EOL
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://motasemyouniss:qNSD1GhJja1Nlq3s@moe2.pbhao4j.mongodb.net/?retryWrites=true&w=majority&appName=moe2
PUSH_SECRET_TOKEN=your-secret-token-here
ADMIN_TOKEN=admin-secret-token
FRONTEND_URL=http://18.133.233.233
EOL

# Start backend with PM2
echo "===== Starting backend with PM2 ====="
pm2 start src/server.js --name "access-control-backend"
pm2 save

# Set up PM2 to start on reboot
echo "===== Setting up PM2 startup ====="
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Set up frontend
echo "===== Setting up frontend ====="
cd ..
npm install

# Create production .env file
echo "===== Creating frontend .env.production ====="
echo "VITE_API_URL=http://18.133.233.233:3000" > .env.production

# Build frontend
echo "===== Building frontend ====="
npm run build

# Configure Nginx
echo "===== Configuring Nginx ====="
sudo bash -c 'cat > /etc/nginx/conf.d/access-control.conf << EOL
server {
    listen 80;
    server_name _;

    location / {
        root /home/ec2-user/QR/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL'

# Test Nginx config
echo "===== Testing Nginx configuration ====="
sudo nginx -t

# Start Nginx
echo "===== Starting Nginx ====="
sudo systemctl start nginx
sudo systemctl enable nginx

# Show completion message
echo "===== Deployment complete! ====="
echo "Your application should now be accessible at: http://18.133.233.233"
echo "Update Smart Community Cloud Platform with these endpoints:"
echo "- Real-time event push address: http://18.133.233.233/api/push-events"
echo "- Device status push address: http://18.133.233.233/api/push-events"
echo "- Online verification opening address: http://18.133.233.233/api/verify-access"
echo "- Device call push address: http://18.133.233.233/api/push-events" 