/**
 * Transaction Store Module
 * Simple in-memory storage for tracking PhonePe transactions
 * In production, use a proper database like MongoDB or PostgreSQL
 */

class TransactionStore {
  constructor() {
    this.transactions = new Map();
  }

  /**
   * Store a new transaction
   * @param {string} merchantTransactionId - Transaction ID
   * @param {Object} transactionData - Transaction details
   */
  storeTransaction(merchantTransactionId, transactionData) {
    this.transactions.set(merchantTransactionId, {
      ...transactionData,
      status: 'PENDING',
      createdAt: new Date(),
      lastChecked: new Date(),
      retryCount: 0,
      emailSent: false
    });
  }

  /**
   * Update transaction status
   * @param {string} merchantTransactionId - Transaction ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data to store
   */
  updateTransaction(merchantTransactionId, status, additionalData = {}) {
    const transaction = this.transactions.get(merchantTransactionId);
    if (transaction) {
      this.transactions.set(merchantTransactionId, {
        ...transaction,
        ...additionalData,
        status,
        lastChecked: new Date(),
        retryCount: transaction.retryCount + 1
      });
    }
  }

  /**
   * Get transaction by ID
   * @param {string} merchantTransactionId - Transaction ID
   * @returns {Object|null} Transaction data
   */
  getTransaction(merchantTransactionId) {
    return this.transactions.get(merchantTransactionId) || null;
  }

  /**
   * Get all pending transactions
   * @returns {Array} Array of pending transactions
   */
  getPendingTransactions() {
    const pending = [];
    for (const [id, transaction] of this.transactions.entries()) {
      if (transaction.status === 'PENDING' && transaction.retryCount < 10) {
        pending.push({ id, ...transaction });
      }
    }
    return pending;
  }

  /**
   * Remove old completed/failed transactions
   */
  cleanup() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const [id, transaction] of this.transactions.entries()) {
      if (transaction.status !== 'PENDING' && transaction.lastChecked < oneDayAgo) {
        this.transactions.delete(id);
      }
    }
  }
}

module.exports = new TransactionStore();