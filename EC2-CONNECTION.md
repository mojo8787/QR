# EC2 Connection and Deployment Instructions

## Connect to EC2 Instance

1. Open Terminal on your Mac
2. Navigate to the folder where your key file is saved:
   ```bash
   cd ~/Downloads  # or wherever your key file is located
   ```

3. Set correct permissions for your key file:
   ```bash
   chmod 400 qr-access-control-key.pem
   ```

4. Connect to your EC2 instance:
   ```bash
   ssh -i qr-access-control-key.pem ec2-user@18.133.233.233
   ```

## Deploy the Application

Once connected to your EC2 instance, run these commands:

1. Download the deployment script:
   ```bash
   curl -O https://raw.githubusercontent.com/mojo8787/QR/main/deploy-ec2.sh
   ```

2. Make it executable:
   ```bash
   chmod +x deploy-ec2.sh
   ```

3. Run the deployment script:
   ```bash
   ./deploy-ec2.sh
   ```

4. The script will:
   - Update the system
   - Install Node.js, Git, Nginx, and PM2
   - Clone the repository
   - Set up and start the backend
   - Build the frontend
   - Configure Nginx
   - Start all services

## After Deployment

After the script completes successfully:

1. Your application will be accessible at: http://18.133.233.233

2. Update the Smart Community Cloud Platform with these endpoints:
   - Real-time event push address: `http://18.133.233.233/api/push-events`
   - Device status push address: `http://18.133.233.233/api/push-events`
   - Online verification opening address: `http://18.133.233.233/api/verify-access`
   - Device call push address: `http://18.133.233.233/api/push-events`

## Troubleshooting

If you encounter any issues:

1. Check the PM2 logs:
   ```bash
   pm2 logs
   ```

2. Check Nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Restart services if needed:
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ``` 