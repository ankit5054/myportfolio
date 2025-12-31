/**
 * OTP Service Module
 * Handles OTP generation, storage, and verification for email validation
 */

const crypto = require('crypto');
const emailService = require('./emailService');

class OTPService {
  constructor() {
    // In-memory storage for OTPs (use Redis in production)
    this.otpStore = new Map();
    this.OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Generate 6-digit OTP
   * @returns {string} 6-digit OTP
   */
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Send OTP to email
   * @param {string} email - Email address
   * @returns {Promise<Object>} Result with success status
   */
  async sendOTP(email) {
    try {
      const otp = this.generateOTP();
      const expiresAt = Date.now() + this.OTP_EXPIRY;

      // Store OTP with expiry
      this.otpStore.set(email, { otp, expiresAt });

      // Send OTP email
      await emailService.sendOTPEmail(email, otp);

      console.log(`✅ OTP sent to ${email}: ${otp}`); // Remove in production

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  /**
   * Verify OTP
   * @param {string} email - Email address
   * @param {string} otp - OTP to verify
   * @returns {Object} Verification result
   */
  verifyOTP(email, otp) {
    const storedData = this.otpStore.get(email);

    if (!storedData) {
      return { isValid: false, error: 'OTP not found or expired' };
    }

    if (Date.now() > storedData.expiresAt) {
      this.otpStore.delete(email);
      return { isValid: false, error: 'OTP expired' };
    }

    if (storedData.otp !== otp) {
      return { isValid: false, error: 'Invalid OTP' };
    }

    // OTP is valid, remove from store
    this.otpStore.delete(email);
    return { isValid: true, message: 'Email verified successfully' };
  }

  /**
   * Clean expired OTPs (call periodically)
   */
  cleanExpiredOTPs() {
    const now = Date.now();
    for (const [email, data] of this.otpStore.entries()) {
      if (now > data.expiresAt) {
        this.otpStore.delete(email);
      }
    }
  }
}

module.exports = new OTPService();