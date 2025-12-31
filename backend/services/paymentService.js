/**
 * Payment Service Module
 * Handles all Stripe payment operations including creating payment intents and verification
 */

const stripe = require('stripe')(require('../config/config').stripe.secretKey);
const config = require('../config/config');

class PaymentService {
  /**
   * Create a payment intent with Stripe
   * @param {number} amount - Payment amount in dollars
   * @param {string} currency - Payment currency (default: USD)
   * @param {Object} serviceData - Service information
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} Payment intent details
   */
  async createPaymentIntent(amount, currency = config.payment.defaultCurrency, serviceData, customerData) {
    try {
      // Convert amount to cents (Stripe requirement)
      const amountInCents = Math.round(amount * config.payment.centMultiplier);

      // Create payment intent with metadata for tracking
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        metadata: {
          service_id: serviceData.id.toString(),
          service_title: serviceData.title,
          customer_name: customerData.fullName,
          customer_email: customerData.email,
          project_title: customerData.projectTitle || 'Not specified'
        }
      });

      console.log(`Payment intent created: ${paymentIntent.id} for $${amount}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  /**
   * Verify payment completion by retrieving payment intent
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise<Object>} Payment intent object
   */
  async verifyPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      console.log(`Payment verification for ${paymentIntentId}: ${paymentIntent.status}`);
      
      return paymentIntent;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Check if payment was successful
   * @param {Object} paymentIntent - Stripe payment intent object
   * @returns {boolean} True if payment succeeded
   */
  isPaymentSuccessful(paymentIntent) {
    return paymentIntent.status === 'succeeded';
  }

  /**
   * Process webhook event from Stripe
   * @param {Object} rawBody - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} Processed webhook event
   */
  processWebhookEvent(rawBody, signature) {
    try {
      // Verify webhook signature for security
      const event = stripe.webhooks.constructEvent(
        rawBody, 
        signature, 
        config.stripe.webhookSecret
      );

      console.log(`Webhook event received: ${event.type}`);
      return event;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }

  /**
   * Handle different types of webhook events
   * @param {Object} event - Stripe webhook event
   */
  handleWebhookEvent(event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', event.data.object.id);
        // Additional success handling can be added here
        break;
        
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id);
        // Additional failure handling can be added here
        break;
        
      case 'payment_intent.canceled':
        console.log('🚫 Payment canceled:', event.data.object.id);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  }
}

module.exports = new PaymentService();