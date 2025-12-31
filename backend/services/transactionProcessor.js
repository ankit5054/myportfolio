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
    logger.info('Starting transaction processor', null, { intervalMs });

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
    const traceId = logger.generateTraceId();
    const pendingTransactions = transactionStore.getPendingTransactions();

    if (pendingTransactions.length === 0) {
      return;
    }

    logger.info('Processing pending transactions', traceId, { 
      count: pendingTransactions.length 
    });

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
      logger.info('Checking transaction status', traceId, { 
        transactionId: transaction.id,
        retryCount: transaction.retryCount 
      });

      // Check status with PhonePe
      const statusResult = await phonePeService.checkPaymentStatus(transaction.id);
      
      if (statusResult.state === 'COMPLETED') {
        // Payment successful
        transactionStore.updateTransaction(transaction.id, 'COMPLETED', {
          phonepeOrderId: statusResult.orderId,
          completedAt: new Date()
        });

        logger.info('Transaction completed successfully', traceId, { 
          transactionId: transaction.id 
        });

        // Send confirmation emails
        if (transaction.customerData && transaction.serviceData) {
          try {
            await emailService.sendBookingEmails(
              transaction.customerData, 
              transaction.serviceData
            );
            logger.info('Confirmation emails sent for completed transaction', traceId, { 
              transactionId: transaction.id 
            });
          } catch (emailError) {
            logger.error('Failed to send confirmation emails', traceId, { 
              error: emailError.message,
              transactionId: transaction.id 
            });
          }
        }

      } else if (statusResult.state === 'FAILED') {
        // Payment failed
        transactionStore.updateTransaction(transaction.id, 'FAILED', {
          failureReason: 'Payment failed at gateway',
          failedAt: new Date()
        });

        logger.warn('Transaction failed', traceId, { 
          transactionId: transaction.id 
        });

        // Send failure notification only if not already sent
        if (!transaction.emailSent && transaction.customerData && transaction.serviceData) {
          try {
            await emailService.sendPaymentFailureNotification(
              transaction.customerData,
              transaction.serviceData,
              'Payment failed during processing',
              transaction.id
            );
            transactionStore.updateTransaction(transaction.id, 'FAILED', { emailSent: true });
            logger.info('Failure notification sent', traceId, { 
              transactionId: transaction.id 
            });
          } catch (emailError) {
            logger.error('Failed to send failure notification', traceId, { 
              error: emailError.message,
              transactionId: transaction.id 
            });
          }
        }

      } else if (statusResult.state === 'PENDING') {
        // Still pending, update retry count
        transactionStore.updateTransaction(transaction.id, 'PENDING');
        
        logger.info('Transaction still pending', traceId, { 
          transactionId: transaction.id,
          retryCount: transaction.retryCount + 1
        });

        // If too many retries, mark as timeout
        if (transaction.retryCount >= 9) {
          transactionStore.updateTransaction(transaction.id, 'TIMEOUT', {
            timeoutReason: 'Exceeded maximum retry attempts',
            timeoutAt: new Date()
          });

          logger.warn('Transaction timed out', traceId, { 
            transactionId: transaction.id 
          });

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
              logger.error('Failed to send timeout notification', traceId, { 
                error: emailError.message,
                transactionId: transaction.id 
              });
            }
          }
        }
      }

    } catch (error) {
      logger.error('Error processing transaction', traceId, { 
        error: error.message,
        transactionId: transaction.id 
      });

      // Update retry count even on error
      transactionStore.updateTransaction(transaction.id, 'PENDING');
    }
  }
}

module.exports = new TransactionProcessor();