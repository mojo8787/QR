/**
 * Middleware to track request processing time
 */
const performanceMiddleware = (req, res, next) => {
  req.startTime = Date.now();
  
  // Capture original end method
  const originalEnd = res.end;
  
  // Override end method
  res.end = function() {
    const processingTime = Date.now() - req.startTime;
    console.log(`${req.method} ${req.originalUrl} - Processing time: ${processingTime}ms`);
    
    // Add processing time to response headers
    res.set('X-Processing-Time', `${processingTime}ms`);
    
    // Call the original end method
    return originalEnd.apply(this, arguments);
  };
  
  next();
};

module.exports = performanceMiddleware; 