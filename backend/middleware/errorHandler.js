const logger = require('../utils/logger');

const setupErrorHandling = (app) => {
  // 404 Handler - Route not found
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: 404
    });
  });

  // Global Error Handler
  app.use((error, req, res, next) => {
    logger.error({ error: error.message, stack: error.stack }, 'Unhandled error');
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
      statusCode: error.statusCode || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  });
};

module.exports = { setupErrorHandling };