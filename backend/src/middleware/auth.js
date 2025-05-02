/**
 * Middleware to validate the secret token in headers
 */
const validateSecretToken = (req, res, next) => {
  const secretToken = req.headers['x-secret-token'];
  const configuredToken = process.env.PUSH_SECRET_TOKEN;
  
  if (!secretToken) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Missing token',
      timestamp: new Date()
    });
  }
  
  if (secretToken !== configuredToken) {
    console.log(`Invalid token attempt: ${secretToken}`);
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid token',
      timestamp: new Date()
    });
  }
  
  // Token is valid, proceed
  next();
};

/**
 * Middleware for admin authentication (simplified for demo)
 * In a real application, this would use JWT or session-based auth
 */
const adminAuth = (req, res, next) => {
  // For demonstration purposes only
  const adminToken = req.headers['admin-token'];
  
  if (!adminToken || adminToken !== 'admin-secret-token') {
    return res.status(403).json({ 
      success: false, 
      error: 'Forbidden: Admin access required',
      timestamp: new Date()
    });
  }
  
  // Set user info for use in controllers
  req.user = {
    id: 'admin',
    role: 'admin'
  };
  
  next();
};

module.exports = { validateSecretToken, adminAuth }; 