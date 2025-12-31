const transactionProcessor = require('../services/transactionProcessor');
const logger = require('../utils/logger');

const startServer = (app, PORT) => {
  const server = app.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV }, 'Payment API Server Started');
    logger.info('Server ready to accept requests');
    
    // Start transaction processor for pending PhonePe transactions
    transactionProcessor.start(30000); // Check every 30 seconds
    logger.info('Transaction processor started');
  });

  // Set server timeout
  server.timeout = 30000; // 30 seconds

  // Graceful shutdown handling
  const gracefulShutdown = () => {
    logger.info('Shutdown signal received, shutting down gracefully');
    transactionProcessor.stop();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error({ error: error.message, stack: error.stack }, 'Uncaught Exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled Rejection');
    process.exit(1);
  });

  return server;
};

module.exports = { startServer };