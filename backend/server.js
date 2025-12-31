/**
 * Main Server File
 * Entry point for the payment API server with modular architecture
 */

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const paymentController = require('./controllers/paymentController');
const otpController = require('./controllers/otpController');
const transactionProcessor = require('./services/transactionProcessor');
const { asyncHandler } = require('./utils/helpers');
const logger = require('./utils/logger');

// Initialize Express application
const app = express();
const PORT = config.server.port;

/**
 * MIDDLEWARE CONFIGURATION
 */

// Enable CORS for frontend communication
app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true
}));

// Parse JSON requests (except for webhook endpoint)
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path, ip: req.ip }, 'Incoming request');
  next();
});

/**
 * API ROUTES
 */

// PhonePe Payment Creation
// Creates a new PhonePe payment request for UPI payments
app.post('/api/create-phonepe-payment', asyncHandler(paymentController.createPhonePePayment.bind(paymentController)));

// PhonePe Webhook Handler
// Handles PhonePe payment status callbacks
app.post('/api/phonepe-webhook', asyncHandler(paymentController.handlePhonePeWebhook.bind(paymentController)));

// Check Payment Status
// Checks the status of a PhonePe payment
app.get('/api/payment-status/:transactionId', asyncHandler(paymentController.checkPaymentStatus.bind(paymentController)));

// Send Confirmation Emails
// Sends confirmation emails after successful payment
app.post('/api/send-confirmation-emails', asyncHandler(paymentController.sendConfirmationEmails.bind(paymentController)));

// Send Failure Notification
// Sends failure notification email for failed/pending payments
app.post('/api/send-failure-notification', asyncHandler(paymentController.sendFailureNotification.bind(paymentController)));

// Send Contact Message
// Sends contact form message via email
app.post('/api/send-contact-message', asyncHandler(paymentController.sendContactMessage.bind(paymentController)));

// Payment Confirmation
// Verifies payment completion and sends confirmation emails
app.post('/api/confirm-payment', asyncHandler(paymentController.confirmPayment.bind(paymentController)));

// OTP Endpoints
// Send OTP for email verification
app.post('/api/send-otp', asyncHandler(otpController.sendOTP.bind(otpController)));

// Verify OTP for email validation
app.post('/api/verify-otp', asyncHandler(otpController.verifyOTP.bind(otpController)));

// Health Check Endpoint
// Provides API status and health information
app.get('/api/health', asyncHandler(paymentController.healthCheck.bind(paymentController)));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Payment API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      createPhonePePayment: '/api/create-phonepe-payment',
      phonePeWebhook: '/api/phonepe-webhook',
      checkPaymentStatus: '/api/payment-status/:transactionId',
      sendConfirmationEmails: '/api/send-confirmation-emails',
      confirmPayment: '/api/confirm-payment',
      sendOtp: '/api/send-otp',
      verifyOtp: '/api/verify-otp'
    }
  });
});

/**
 * ERROR HANDLING MIDDLEWARE
 */

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

/**
 * SERVER STARTUP
 */

// Start the server
app.listen(PORT, () => {
  logger.info({ port: PORT, frontendUrl: config.server.frontendUrl }, 'Payment API Server Started');
  logger.info('Server ready to accept requests');
  
  // Start transaction processor for pending PhonePe transactions
  transactionProcessor.start(30000); // Check every 30 seconds
  logger.info('Transaction processor started');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  transactionProcessor.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  transactionProcessor.stop();
  process.exit(0);
});