/**
 * Payment Controller Module
 * Handles all payment-related HTTP requests and responses
 */

const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');
const phonePeService = require('../services/phonePeService');
const transactionStore = require('../services/transactionStore');
const logger = require('../utils/logger');
const { 
  validateRequiredFields, 
  validateAmount, 
  createApiResponse, 
  logRequest,
  sanitizeCustomerData 
} = require('../utils/helpers');

class PaymentController {
  /**
   * Create payment intent endpoint
   * POST /api/create-payment-intent
   */
  async createPaymentIntent(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'CREATE_PAYMENT_INTENT');

      const { amount, currency, serviceData, customerData } = req.body;

      // Validate required fields
      const validation = validateRequiredFields(req.body, [
        'amount',
        'serviceData.id',
        'serviceData.title',
        'customerData.fullName',
        'customerData.email'
      ]);

      if (!validation.isValid) {
        logger.warn({ traceId, missingFields: validation.missingFields }, 'Payment intent validation failed');
        return res.status(400).json(
          createApiResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`, 400)
        );
      }

      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.isValid) {
        logger.warn({ traceId, amount }, 'Invalid amount provided');
        return res.status(400).json(
          createApiResponse(false, null, amountValidation.error, 400)
        );
      }

      // Create payment intent using payment service
      const paymentIntent = await paymentService.createPaymentIntent(
        amount, 
        currency, 
        serviceData, 
        customerData
      );

      logger.info({ traceId, paymentIntentId: paymentIntent.paymentIntentId }, 'Payment intent created successfully');

      res.json(
        createApiResponse(true, paymentIntent, 'Payment intent created successfully')
      );

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'Failed to create payment intent');
      res.status(500).json(
        createApiResponse(false, null, 'Failed to create payment intent', 500)
      );
    }
  }

  /**
   * Create PhonePe payment request endpoint
   * POST /api/create-phonepe-payment
   */
  async createPhonePePayment(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'CREATE_PHONEPE_PAYMENT');

      const { amount, serviceData, customerData } = req.body;

      // Validate required fields
      const validation = validateRequiredFields(req.body, [
        'amount',
        'serviceData.id',
        'serviceData.title',
        'customerData.fullName',
        'customerData.email'
      ]);

      if (!validation.isValid) {
        logger.warn({ traceId, missingFields: validation.missingFields }, 'Payment validation failed');
        return res.status(400).json(
          createApiResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`, 400)
        );
      }

      // Create PhonePe payment using official API
      try {
        const paymentResult = await phonePeService.initiatePayment(amount, serviceData, customerData);
        
        // Store transaction as PENDING
        transactionStore.storeTransaction(paymentResult.transactionId, {
          amount,
          serviceData,
          customerData,
          phonepeOrderId: paymentResult.orderId
        });
        
        const paymentRequest = {
          transactionId: paymentResult.transactionId,
          paymentUrl: paymentResult.paymentUrl,
          amount: amount,
          status: 'PENDING',
          paymentMethod: 'phonepe'
        };
        
        logger.info({ traceId, transactionId: paymentResult.transactionId }, 'PhonePe payment initiated and stored as PENDING');
        
        res.json(
          createApiResponse(true, paymentRequest, 'PhonePe payment initiated successfully')
        );
      } catch (error) {
        logger.error({ traceId, error: error.message }, 'PhonePe payment initiation failed');
        
        // Fallback to UPI deep link
        const transactionId = `MT${Date.now()}`;
        const amount_rupees = amount / 100;
        const merchantUpiId = 'ankit.mishra9780@paytm';
        
        const paymentRequest = {
          transactionId,
          paymentUrl: `upi://pay?pa=${merchantUpiId}&pn=Ankit%20Mishra&am=${amount_rupees}&cu=INR&tn=${encodeURIComponent(serviceData.title)}`,
          amount: amount,
          status: 'PENDING',
          paymentMethod: 'phonepe'
        };
        
        logger.info({ traceId, transactionId }, 'Fallback UPI payment created');
        
        res.json(
          createApiResponse(true, paymentRequest, 'Payment request created successfully')
        );
      }

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'Failed to create PhonePe payment request');
      res.status(500).json(
        createApiResponse(false, null, 'Failed to create PhonePe payment request', 500)
      );
    }
  }

  /**
   * Confirm payment and send emails endpoint
   * POST /api/confirm-payment
   */
  async confirmPayment(req, res) {
    try {
      logRequest(req, 'CONFIRM_PAYMENT');

      const { paymentIntentId, serviceData, customerData } = req.body;

      // Validate required fields
      const validation = validateRequiredFields(req.body, [
        'paymentIntentId',
        'serviceData',
        'customerData'
      ]);

      if (!validation.isValid) {
        return res.status(400).json(
          createApiResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`, 400)
        );
      }

      // Verify payment with Stripe
      const paymentIntent = await paymentService.verifyPayment(paymentIntentId);

      if (!paymentService.isPaymentSuccessful(paymentIntent)) {
        console.log(`❌ Payment not completed: ${paymentIntentId} - Status: ${paymentIntent.status}`);
        return res.status(400).json(
          createApiResponse(false, null, 'Payment not completed', 400)
        );
      }

      // Send booking confirmation emails
      await emailService.sendBookingEmails(customerData, serviceData);

      console.log(`✅ Payment confirmed and emails sent for: ${customerData.email}`);

      res.json(
        createApiResponse(true, { paymentIntentId }, 'Payment confirmed and emails sent successfully')
      );

    } catch (error) {
      res.status(500).json(
        createApiResponse(false, null, 'Failed to confirm payment', 500)
      );
    }
  }

  /**
   * Handle Stripe webhook events
   * POST /api/webhook
   */
  async handleWebhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        console.log('❌ Missing Stripe signature in webhook');
        return res.status(400).json(
          createApiResponse(false, null, 'Missing Stripe signature', 400)
        );
      }

      // Process webhook event using payment service
      const event = paymentService.processWebhookEvent(req.body, signature);
      
      // Handle the specific event type
      paymentService.handleWebhookEvent(event);

      console.log(`✅ Webhook processed successfully: ${event.type}`);

      res.json(
        createApiResponse(true, { received: true }, 'Webhook processed successfully')
      );

    } catch (error) {
      res.status(400).json(
        createApiResponse(false, null, `Webhook Error: ${error.message}`, 400)
      );
    }
  }

  /**
   * Handle PhonePe webhook events
   * POST /api/phonepe-webhook
   */
  async handlePhonePeWebhook(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'PHONEPE_WEBHOOK');

      const authorization = req.headers['authorization'];
      const responseBody = JSON.stringify(req.body);

      if (!authorization) {
        logger.warn({ traceId }, 'Missing authorization header in PhonePe webhook');
        return res.status(400).json(
          createApiResponse(false, null, 'Missing authorization header', 400)
        );
      }

      // Validate callback using PhonePe SDK
      const callbackData = phonePeService.validateCallback(authorization, responseBody);
      
      logger.info({ traceId, type: callbackData.type, orderId: callbackData.orderId, state: callbackData.state }, 'PhonePe webhook validated successfully');

      // Handle different callback types
      switch (callbackData.type) {
        case 'CHECKOUT_ORDER_COMPLETED':
          logger.info({ traceId, orderId: callbackData.orderId }, 'Payment completed successfully');
          
          // Try to send confirmation emails if we have the data
          try {
            // In a real application, you'd fetch this from a database using the transaction ID
            // For now, we'll log that emails should be sent
            logger.info({ traceId, orderId: callbackData.orderId, originalMerchantOrderId: callbackData.originalMerchantOrderId }, 'Payment completed - emails should be triggered');
          } catch (emailError) {
            logger.error({ traceId, error: emailError.message }, 'Failed to send confirmation emails');
          }
          break;
        case 'CHECKOUT_ORDER_FAILED':
          logger.warn({ traceId, orderId: callbackData.orderId }, 'Payment failed');
          
          // Send failure notification email
          try {
            // In a real application, you'd fetch booking data from database
            logger.info({ traceId, orderId: callbackData.orderId, originalMerchantOrderId: callbackData.originalMerchantOrderId, reason: 'Payment gateway failure or user cancellation' }, 'Payment failed - failure notification should be sent');
          } catch (emailError) {
            logger.error({ traceId, error: emailError.message }, 'Failed to send failure notification');
          }
          break;
        default:
          logger.info({ traceId, type: callbackData.type }, 'Unhandled callback type');
      }

      res.json(
        createApiResponse(true, { received: true }, 'PhonePe webhook processed successfully')
      );

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'PhonePe webhook processing failed');
      res.status(400).json(
        createApiResponse(false, null, `PhonePe Webhook Error: ${error.message}`, 400)
      );
    }
  }

  /**
   * Send confirmation emails after payment
   * POST /api/send-confirmation-emails
   */
  async sendConfirmationEmails(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'SEND_CONFIRMATION_EMAILS');

      const { transactionId } = req.body;

      if (!transactionId) {
        logger.warn({ traceId }, 'Missing transaction ID for email confirmation');
        return res.status(400).json(
          createApiResponse(false, null, 'Transaction ID is required', 400)
        );
      }

      // Check if emails were already sent for this transaction
      const emailSentKey = `email_sent_${transactionId}`;
      if (global.emailsSent && global.emailsSent[emailSentKey]) {
        logger.info({ traceId, transactionId }, 'Emails already sent for this transaction');
        return res.json(
          createApiResponse(true, { sent: false, reason: 'already_sent' }, 'Emails already sent for this transaction')
        );
      }

      // Get booking data from localStorage equivalent (you might want to store this in a database)
      const bookingData = JSON.parse(req.body.bookingData || '{}');
      const serviceData = JSON.parse(req.body.serviceData || '{}');

      if (!bookingData.email || !serviceData.title) {
        logger.warn({ traceId }, 'Missing booking or service data for email confirmation');
        return res.status(400).json(
          createApiResponse(false, null, 'Booking and service data are required', 400)
        );
      }

      // Send confirmation emails
      await emailService.sendBookingEmails(bookingData, serviceData);
      
      // Mark as sent
      if (!global.emailsSent) global.emailsSent = {};
      global.emailsSent[emailSentKey] = true;
      
      logger.info({ traceId, customerEmail: bookingData.email, transactionId }, 'Confirmation emails sent successfully');

      res.json(
        createApiResponse(true, { sent: true }, 'Confirmation emails sent successfully')
      );

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'Failed to send confirmation emails');
      res.status(500).json(
        createApiResponse(false, null, 'Failed to send confirmation emails', 500)
      );
    }
  }
  /**
   * Send payment failure notification
   * POST /api/send-failure-notification
   */
  async sendFailureNotification(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'SEND_FAILURE_NOTIFICATION');

      const { transactionId, reason, bookingData, serviceData } = req.body;

      if (!transactionId || !reason) {
        logger.warn({ traceId }, 'Missing required data for failure notification');
        return res.status(400).json(
          createApiResponse(false, null, 'Transaction ID and reason are required', 400)
        );
      }

      const customerData = JSON.parse(bookingData || '{}');
      const service = JSON.parse(serviceData || '{}');

      if (!customerData.fullName || !service.title) {
        logger.warn({ traceId }, 'Missing booking or service data for failure notification');
        return res.status(400).json(
          createApiResponse(false, null, 'Booking and service data are required', 400)
        );
      }

      // Send failure notification email
      await emailService.sendPaymentFailureNotification(customerData, service, reason, transactionId);
      
      logger.info({ traceId, customerEmail: customerData.email, transactionId, reason }, 'Payment failure notification sent');

      res.json(
        createApiResponse(true, { sent: true }, 'Failure notification sent successfully')
      );

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'Failed to send failure notification');
      res.status(500).json(
        createApiResponse(false, null, 'Failed to send failure notification', 500)
      );
    }
  }

  /**
   * Send contact message
   * POST /api/send-contact-message
   */
  async sendContactMessage(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'SEND_CONTACT_MESSAGE');

      const { name, email, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        logger.warn({ traceId }, 'Missing required fields for contact message');
        return res.status(400).json(
          createApiResponse(false, null, 'Name, email, and message are required', 400)
        );
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        logger.warn({ traceId }, 'Invalid email format in contact message');
        return res.status(400).json(
          createApiResponse(false, null, 'Invalid email format', 400)
        );
      }

      // Send contact message email
      await emailService.sendContactMessage({ name, email, message });
      
      logger.info({ traceId, senderEmail: email, senderName: name }, 'Contact message sent successfully');

      res.json(
        createApiResponse(true, { sent: true }, 'Message sent successfully')
      );

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'Failed to send contact message');
      res.status(500).json(
        createApiResponse(false, null, 'Failed to send message', 500)
      );
    }
  }

  async checkPaymentStatus(req, res) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logRequest(req, 'CHECK_PAYMENT_STATUS');

      const { transactionId } = req.params;

      if (!transactionId) {
        logger.warn({ traceId }, 'Missing transaction ID');
        return res.status(400).json(
          createApiResponse(false, null, 'Transaction ID is required', 400)
        );
      }

      // Check payment status using PhonePe service
      const statusResult = await phonePeService.checkPaymentStatus(transactionId);
      
      logger.info({ traceId, transactionId, state: statusResult.state }, 'Payment status checked successfully');

      res.json(
        createApiResponse(true, statusResult, 'Payment status retrieved successfully')
      );

    } catch (error) {
      logger.error({ traceId, error: error.message }, 'Payment status check failed');
      res.status(500).json(
        createApiResponse(false, null, 'Failed to check payment status', 500)
      );
    }
  }

  /**
   * Health check endpoint
   * GET /api/health
   */
  async healthCheck(req, res) {
    try {
      const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      };

      res.json(
        createApiResponse(true, healthData, 'Payment API is running')
      );

    } catch (error) {
      res.status(500).json(
        createApiResponse(false, null, 'Health check failed', 500)
      );
    }
  }
}

module.exports = new PaymentController();