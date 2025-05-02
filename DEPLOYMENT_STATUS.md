# QR Access Control System - Deployment Status

## Current Infrastructure

### Production Environment
- **Server**: AWS EC2 t2.micro instance
- **IP Address**: 18.133.233.233
- **URL**: http://18.133.233.233
- **Backend API**: http://18.133.233.233/api
- **Region**: eu-west-2 (London)
- **OS**: Amazon Linux 2023

### Database
- **Service**: MongoDB Atlas
- **Cluster**: moe2.pbhao4j.mongodb.net
- **Username**: motasemyouniss
- **Database**: push-notifications

### Services Running
- **Web Server**: Nginx 1.26.3
- **Backend**: Node.js 18.20.8 (managed by PM2)
- **Process Manager**: PM2 6.0.5

## Integration Points

### Smart Community Cloud Platform Configuration
The following endpoints have been configured to integrate with the platform:

- **Real-time event push**: http://18.133.233.233/api/push-events
- **Device status push**: http://18.133.233.233/api/push-events
- **Online verification**: http://18.133.233.233/api/verify-access
- **Device call push**: http://18.133.233.233/api/push-events
- **Secret Token Name**: X-Secret-Token
- **Secret Token Value**: your-secret-token-here
- **UUID**: 78257432-e368-47e0-912c-5f8c159ac0fe

## Maintenance

### Server Access
```bash
# Connect to the server
ssh -i qr-access-control-key.pem ec2-user@18.133.233.233
```

### Monitoring
```bash
# Check backend process status
pm2 list

# View backend logs
pm2 logs

# Check Nginx web server status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
# Restart backend
pm2 restart access-control-backend

# Restart all backend processes
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx
```

### Update Application
```bash
# Navigate to the application directory
cd ~/QR

# Pull latest changes
git pull

# Update backend
cd backend
npm install
pm2 restart access-control-backend

# Update frontend
cd ..
npm install
npm run build

# No need to restart Nginx as the static files are automatically served
```

## Backup and Restore

### Manual Backup
```bash
# Backup configuration files
mkdir -p ~/backups/$(date +%Y%m%d)
cp -r ~/QR/backend/.env ~/backups/$(date +%Y%m%d)/
cp /etc/nginx/conf.d/access-control.conf ~/backups/$(date +%Y%m%d)/
```

### MongoDB Backup
MongoDB Atlas provides automated backups. You can also:
- Use Atlas UI to create on-demand backups
- Export data using MongoDB Compass or command-line tools

## Security

- EC2 Security Group allows ports 22 (SSH), 80 (HTTP), and 443 (HTTPS)
- Access requires the qr-access-control-key.pem file
- API endpoints that modify data require authentication tokens
- MongoDB Atlas is secured with username/password and IP allowlist

## Development Environment

- Local development server runs on ports starting at 5173 (increments if occupied)
- Backend development server runs on port 3000
- Environment variables are managed in .env and .env.production files
- Code is hosted on GitHub: https://github.com/mojo8787/QR.git

## Troubleshooting

### Common Issues

1. **Application not responding**
   ```bash
   # Check if processes are running
   pm2 list
   
   # Check backend logs
   pm2 logs
   
   # Restart if needed
   pm2 restart all
   ```

2. **Database connection issues**
   ```bash
   # Check MongoDB connection in backend logs
   pm2 logs
   
   # Verify .env file has correct MongoDB URI
   cat ~/QR/backend/.env
   ```

3. **Web server errors**
   ```bash
   # Check Nginx configuration
   sudo nginx -t
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

## Contact Information

For issues with the deployment, contact:
- System administrator: [Your contact information]
- GitHub repository: https://github.com/mojo8787/QR 