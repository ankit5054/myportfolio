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
    const traceId = logger.generateTraceId();
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
        logger.warn('Payment intent validation failed', traceId, { missingFields: validation.missingFields });
        return res.status(400).json(
          createApiResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`, 400)
        );
      }

      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.isValid) {
        logger.warn('Invalid amount provided', traceId, { amount });
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

      logger.info('Payment intent created successfully', traceId, { paymentIntentId: paymentIntent.paymentIntentId });

      res.json(
        createApiResponse(true, paymentIntent, 'Payment intent created successfully')
      );

    } catch (error) {
      logger.error('Failed to create payment intent', traceId, { error: error.message });
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
    const traceId = logger.generateTraceId();
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
        logger.warn('Payment validation failed', traceId, { missingFields: validation.missingFields });
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
        
        logger.info('PhonePe payment initiated and stored as PENDING', traceId, { 
          transactionId: paymentResult.transactionId 
        });
        
        res.json(
          createApiResponse(true, paymentRequest, 'PhonePe payment initiated successfully')
        );
      } catch (error) {
        logger.error('PhonePe payment initiation failed', traceId, { error: error.message });
        
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
        
        logger.info('Fallback UPI payment created', traceId, { transactionId });
        
        res.json(
          createApiResponse(true, paymentRequest, 'Payment request created successfully')
        );
      }

    } catch (error) {
      logger.error('Failed to create PhonePe payment request', traceId, { error: error.message });
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
    const traceId = logger.generateTraceId();
    try {
      logRequest(req, 'PHONEPE_WEBHOOK');

      const authorization = req.headers['authorization'];
      const responseBody = JSON.stringify(req.body);

      if (!authorization) {
        logger.warn('Missing authorization header in PhonePe webhook', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Missing authorization header', 400)
        );
      }

      // Validate callback using PhonePe SDK
      const callbackData = phonePeService.validateCallback(authorization, responseBody);
      
      logger.info('PhonePe webhook validated successfully', traceId, { 
        type: callbackData.type,
        orderId: callbackData.orderId,
        state: callbackData.state
      });

      // Handle different callback types
      switch (callbackData.type) {
        case 'CHECKOUT_ORDER_COMPLETED':
          logger.info('Payment completed successfully', traceId, { orderId: callbackData.orderId });
          
          // Try to send confirmation emails if we have the data
          try {
            // In a real application, you'd fetch this from a database using the transaction ID
            // For now, we'll log that emails should be sent
            logger.info('Payment completed - emails should be triggered', traceId, {
              orderId: callbackData.orderId,
              originalMerchantOrderId: callbackData.originalMerchantOrderId
            });
          } catch (emailError) {
            logger.error('Failed to send confirmation emails', traceId, { error: emailError.message });
          }
          break;
        case 'CHECKOUT_ORDER_FAILED':
          logger.warn('Payment failed', traceId, { orderId: callbackData.orderId });
          
          // Send failure notification email
          try {
            // In a real application, you'd fetch booking data from database
            logger.info('Payment failed - failure notification should be sent', traceId, {
              orderId: callbackData.orderId,
              originalMerchantOrderId: callbackData.originalMerchantOrderId,
              reason: 'Payment gateway failure or user cancellation'
            });
          } catch (emailError) {
            logger.error('Failed to send failure notification', traceId, { error: emailError.message });
          }
          break;
        default:
          logger.info('Unhandled callback type', traceId, { type: callbackData.type });
      }

      res.json(
        createApiResponse(true, { received: true }, 'PhonePe webhook processed successfully')
      );

    } catch (error) {
      logger.error('PhonePe webhook processing failed', traceId, { error: error.message });
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
    const traceId = logger.generateTraceId();
    try {
      logRequest(req, 'SEND_CONFIRMATION_EMAILS');

      const { transactionId } = req.body;

      if (!transactionId) {
        logger.warn('Missing transaction ID for email confirmation', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Transaction ID is required', 400)
        );
      }

      // Get booking data from localStorage equivalent (you might want to store this in a database)
      const bookingData = JSON.parse(req.body.bookingData || '{}');
      const serviceData = JSON.parse(req.body.serviceData || '{}');

      if (!bookingData.email || !serviceData.title) {
        logger.warn('Missing booking or service data for email confirmation', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Booking and service data are required', 400)
        );
      }

      // Send confirmation emails
      await emailService.sendBookingEmails(bookingData, serviceData);
      
      logger.info('Confirmation emails sent successfully', traceId, { 
        customerEmail: bookingData.email,
        transactionId
      });

      res.json(
        createApiResponse(true, { sent: true }, 'Confirmation emails sent successfully')
      );

    } catch (error) {
      logger.error('Failed to send confirmation emails', traceId, { error: error.message });
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
    const traceId = logger.generateTraceId();
    try {
      logRequest(req, 'SEND_FAILURE_NOTIFICATION');

      const { transactionId, reason, bookingData, serviceData } = req.body;

      if (!transactionId || !reason) {
        logger.warn('Missing required data for failure notification', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Transaction ID and reason are required', 400)
        );
      }

      const customerData = JSON.parse(bookingData || '{}');
      const service = JSON.parse(serviceData || '{}');

      if (!customerData.fullName || !service.title) {
        logger.warn('Missing booking or service data for failure notification', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Booking and service data are required', 400)
        );
      }

      // Send failure notification email
      await emailService.sendPaymentFailureNotification(customerData, service, reason, transactionId);
      
      logger.info('Payment failure notification sent', traceId, { 
        customerEmail: customerData.email,
        transactionId,
        reason
      });

      res.json(
        createApiResponse(true, { sent: true }, 'Failure notification sent successfully')
      );

    } catch (error) {
      logger.error('Failed to send failure notification', traceId, { error: error.message });
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
    const traceId = logger.generateTraceId();
    try {
      logRequest(req, 'SEND_CONTACT_MESSAGE');

      const { name, email, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        logger.warn('Missing required fields for contact message', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Name, email, and message are required', 400)
        );
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        logger.warn('Invalid email format in contact message', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Invalid email format', 400)
        );
      }

      // Send contact message email
      await emailService.sendContactMessage({ name, email, message });
      
      logger.info('Contact message sent successfully', traceId, { 
        senderEmail: email,
        senderName: name
      });

      res.json(
        createApiResponse(true, { sent: true }, 'Message sent successfully')
      );

    } catch (error) {
      logger.error('Failed to send contact message', traceId, { error: error.message });
      res.status(500).json(
        createApiResponse(false, null, 'Failed to send message', 500)
      );
    }
  }

  async checkPaymentStatus(req, res) {
    const traceId = logger.generateTraceId();
    try {
      logRequest(req, 'CHECK_PAYMENT_STATUS');

      const { transactionId } = req.params;

      if (!transactionId) {
        logger.warn('Missing transaction ID', traceId);
        return res.status(400).json(
          createApiResponse(false, null, 'Transaction ID is required', 400)
        );
      }

      // Check payment status using PhonePe service
      const statusResult = await phonePeService.checkPaymentStatus(transactionId);
      
      logger.info('Payment status checked successfully', traceId, { 
        transactionId,
        state: statusResult.state
      });

      res.json(
        createApiResponse(true, statusResult, 'Payment status retrieved successfully')
      );

    } catch (error) {
      logger.error('Payment status check failed', traceId, { error: error.message });
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