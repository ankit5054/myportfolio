/**
 * Utility Functions Module
 * Contains helper functions for validation, error handling, and common operations
 */

/**
 * Validate required fields in request body
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid boolean and missing fields
 */
function validateRequiredFields(data, requiredFields) {
  const missingFields = requiredFields.filter(field => {
    const value = getNestedValue(data, field);
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Get nested object value using dot notation
 * @param {Object} obj - Object to search in
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @returns {*} Value at the specified path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate payment amount
 * @param {number} amount - Amount to validate
 * @returns {Object} Validation result
 */
function validateAmount(amount) {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 999999) {
    return { isValid: false, error: 'Amount exceeds maximum limit' };
  }
  
  return { isValid: true };
}

/**
 * Create standardized API response
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Standardized response object
 */
function createApiResponse(success, data = null, message = '', statusCode = 200) {
  return {
    success,
    data,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle async errors in Express routes
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Log request details for debugging
 * @param {Object} req - Express request object
 * @param {string} action - Action being performed
 */
function logRequest(req, action) {
  console.log(`[${new Date().toISOString()}] ${action} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Create a deep copy for logging to avoid modifying original data
    const sanitizedBody = JSON.parse(JSON.stringify(req.body));
    if (sanitizedBody.customerData?.email) {
      sanitizedBody.customerData.email = '***@***.com';
    }
    console.log('Request body:', JSON.stringify(sanitizedBody, null, 2));
  }
}

/**
 * Sanitize customer data for logging (remove sensitive info)
 * @param {Object} customerData - Customer data object
 * @returns {Object} Sanitized customer data
 */
function sanitizeCustomerData(customerData) {
  const sanitized = { ...customerData };
  if (sanitized.email) {
    sanitized.email = sanitized.email.replace(/(.{2}).*@/, '$1***@');
  }
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.replace(/(\d{3}).*(\d{4})/, '$1***$2');
  }
  return sanitized;
}

/**
 * Generate unique transaction ID
 * @returns {string} Unique transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN_${timestamp}_${random}`.toUpperCase();
}

module.exports = {
  validateRequiredFields,
  getNestedValue,
  isValidEmail,
  validateAmount,
  createApiResponse,
  asyncHandler,
  logRequest,
  sanitizeCustomerData,
  generateTransactionId
};