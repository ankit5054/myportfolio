const express = require('express');
const paymentController = require('../controllers/paymentController');
const otpController = require('../controllers/otpController');
const { asyncHandler } = require('../utils/helpers');
const { paymentLimiter } = require('../middleware');

const router = express.Router();

// PhonePe Payment Creation
router.post('/create-phonepe-payment', paymentLimiter, asyncHandler(paymentController.createPhonePePayment.bind(paymentController)));

// PhonePe Webhook Handler
router.post('/phonepe-webhook', asyncHandler(paymentController.handlePhonePeWebhook.bind(paymentController)));

// Check Payment Status
router.get('/payment-status/:transactionId', asyncHandler(paymentController.checkPaymentStatus.bind(paymentController)));

// Send Confirmation Emails
router.post('/send-confirmation-emails', paymentLimiter, asyncHandler(paymentController.sendConfirmationEmails.bind(paymentController)));

// Send Failure Notification
router.post('/send-failure-notification', paymentLimiter, asyncHandler(paymentController.sendFailureNotification.bind(paymentController)));

// Send Contact Message
router.post('/send-contact-message', asyncHandler(paymentController.sendContactMessage.bind(paymentController)));

// Payment Confirmation
router.post('/confirm-payment', paymentLimiter, asyncHandler(paymentController.confirmPayment.bind(paymentController)));

// OTP Endpoints
router.post('/send-otp', asyncHandler(otpController.sendOTP.bind(otpController)));
router.post('/verify-otp', asyncHandler(otpController.verifyOTP.bind(otpController)));

// Health Check Endpoint
router.get('/health', asyncHandler(paymentController.healthCheck.bind(paymentController)));

// Root endpoint
router.get('/', (req, res) => {
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

module.exports = router;