/**
 * Transaction Processor Module
 * Background job to process pending PhonePe transactions
 */

const phonePeService = require('./phonePeService');
const emailService = require('./emailService');
const transactionStore = require('./transactionStore');
const logger = require('../utils/logger');

class TransactionProcessor {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Start the background processor
   * @param {number} intervalMs - Check interval in milliseconds (default: 30 seconds)
   */
  start(intervalMs = 30000) {
    if (this.isRunning) {
      logger.warn('Transaction processor is already running');
      return;
    }

    this.isRunning = true;
    logger.info({ intervalMs }, 'Starting transaction processor');

    this.intervalId = setInterval(async () => {
      await this.processPendingTransactions();
    }, intervalMs);

    // Run immediately on start
    this.processPendingTransactions();
  }

  /**
   * Stop the background processor
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    logger.info('Transaction processor stopped');
  }

  /**
   * Process all pending transactions
   */
  async processPendingTransactions() {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const pendingTransactions = transactionStore.getPendingTransactions();

    if (pendingTransactions.length === 0) {
      return;
    }

    logger.info({ traceId, count: pendingTransactions.length }, 'Processing pending transactions');

    for (const transaction of pendingTransactions) {
      await this.processTransaction(transaction, traceId);
    }

    // Cleanup old transactions
    transactionStore.cleanup();
  }

  /**
   * Process a single transaction
   * @param {Object} transaction - Transaction data
   * @param {string} traceId - Trace ID for logging
   */
  async processTransaction(transaction, traceId) {
    try {
      logger.info({ traceId, transactionId: transaction.id, retryCount: transaction.retryCount }, 'Checking transaction status');

      // Check status with PhonePe
      const statusResult = await phonePeService.checkPaymentStatus(transaction.id);
      
      if (statusResult.state === 'COMPLETED') {
        // Payment successful
        transactionStore.updateTransaction(transaction.id, 'COMPLETED', {
          phonepeOrderId: statusResult.orderId,
          completedAt: new Date()
        });

        logger.info({ traceId, transactionId: transaction.id }, 'Transaction completed successfully');

        // Send confirmation emails only if not already sent
        if (!transaction.emailSent && transaction.customerData && transaction.serviceData) {
          try {
            await emailService.sendBookingEmails(
              transaction.customerData, 
              transaction.serviceData,
              transaction.id
            );
            transactionStore.updateTransaction(transaction.id, 'COMPLETED', { emailSent: true });
            logger.info({ traceId, transactionId: transaction.id }, 'Confirmation emails sent for completed transaction');
          } catch (emailError) {
            logger.error({ traceId, error: emailError.message, transactionId: transaction.id }, 'Failed to send confirmation emails');
          }
        }

      } else if (statusResult.state === 'FAILED') {
        // Payment failed - only send notification once
        if (!transaction.emailSent) {
          transactionStore.updateTransaction(transaction.id, 'FAILED', {
            failureReason: 'Payment failed at gateway',
            failedAt: new Date(),
            emailSent: true
          });

          logger.warn({ traceId, transactionId: transaction.id }, 'Transaction failed');

          // Send failure notification
          if (transaction.customerData && transaction.serviceData) {
            try {
              await emailService.sendPaymentFailureNotification(
                transaction.customerData,
                transaction.serviceData,
                'Payment failed during processing',
                transaction.id
              );
              logger.info({ traceId, transactionId: transaction.id }, 'Failure notification sent');
            } catch (emailError) {
              logger.error({ traceId, error: emailError.message, transactionId: transaction.id }, 'Failed to send failure notification');
            }
          }
        }

      } else if (statusResult.state === 'PENDING') {
        // Still pending, update retry count
        transactionStore.updateTransaction(transaction.id, 'PENDING');
        
        logger.info({ traceId, transactionId: transaction.id, retryCount: transaction.retryCount + 1 }, 'Transaction still pending');

        // If too many retries, mark as timeout
        if (transaction.retryCount >= 9) {
          transactionStore.updateTransaction(transaction.id, 'TIMEOUT', {
            timeoutReason: 'Exceeded maximum retry attempts',
            timeoutAt: new Date()
          });

          logger.warn({ traceId, transactionId: transaction.id }, 'Transaction timed out');

          // Send timeout notification only if not already sent
          if (!transaction.emailSent && transaction.customerData && transaction.serviceData) {
            try {
              await emailService.sendPaymentFailureNotification(
                transaction.customerData,
                transaction.serviceData,
                'Payment timeout - exceeded maximum retry attempts',
                transaction.id
              );
              transactionStore.updateTransaction(transaction.id, 'TIMEOUT', { emailSent: true });
            } catch (emailError) {
              logger.error({ traceId, error: emailError.message, transactionId: transaction.id }, 'Failed to send timeout notification');
            }
          }
        }
      }

    } catch (error) {
      logger.error({ traceId, error: error.message, transactionId: transaction.id }, 'Error processing transaction');

      // Update retry count even on error
      transactionStore.updateTransaction(transaction.id, 'PENDING');
    }
  }
}

module.exports = new TransactionProcessor();