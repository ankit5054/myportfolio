const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require('pg-sdk-node');
const { randomUUID } = require('crypto');

class PhonePeService {
  constructor() {
    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION) || 1;
    const env = Env.SANDBOX; // Change to Env.PRODUCTION for live
    
    // Initialize PhonePe SDK client
    this.client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
  }

  generateTransactionId() {
    return randomUUID();
  }

  async initiatePayment(amount, serviceData, customerData) {
    const merchantOrderId = this.generateTransactionId();
    
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100) // Convert to paisa
      .redirectUrl(`${process.env.FRONTEND_URL}/payment-success?txnId=${merchantOrderId}`)
      .build();

    try {
      const response = await this.client.pay(request);
      
      return {
        success: true,
        transactionId: merchantOrderId,
        paymentUrl: response.redirectUrl,
        orderId: response.orderId,
        state: response.state
      };
    } catch (error) {
      throw new Error(`PhonePe SDK Error: ${error.message}`);
    }
  }

  async checkPaymentStatus(merchantOrderId, details = false) {
    try {
      const response = await this.client.getOrderStatus(merchantOrderId, details);
      return {
        orderId: response.orderId,
        state: response.state,
        amount: response.amount,
        expireAt: response.expireAt,
        paymentDetails: response.paymentDetails
      };
    } catch (error) {
      throw new Error(`Status check failed: ${error.message}`);
    }
  }

  validateCallback(authorization, responseBody) {
    try {
      const username = process.env.PHONEPE_WEBHOOK_USERNAME;
      const password = process.env.PHONEPE_WEBHOOK_PASSWORD;
      
      const callbackResponse = this.client.validateCallback(
        username,
        password,
        authorization,
        responseBody
      );
      
      return {
        type: callbackResponse.type,
        orderId: callbackResponse.payload.orderId,
        originalMerchantOrderId: callbackResponse.payload.originalMerchantOrderId,
        state: callbackResponse.payload.state,
        amount: callbackResponse.payload.amount
      };
    } catch (error) {
      throw new Error(`Callback validation failed: ${error.message}`);
    }
  }
}

module.exports = new PhonePeService();