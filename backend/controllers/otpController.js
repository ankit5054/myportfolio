/**
 * OTP Controller Module
 * Handles OTP-related HTTP requests for email verification
 */

const otpService = require('../services/otpService');
const { validateRequiredFields, isValidEmail, createApiResponse, logRequest } = require('../utils/helpers');

class OTPController {
  /**
   * Send OTP to email endpoint
   * POST /api/send-otp
   */
  async sendOTP(req, res) {
    try {
      logRequest(req, 'SEND_OTP');

      const { email } = req.body;

      // Validate required fields
      const validation = validateRequiredFields(req.body, ['email']);
      if (!validation.isValid) {
        return res.status(400).json(
          createApiResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`, 400)
        );
      }

      // Validate email format
      if (!isValidEmail(email)) {
        return res.status(400).json(
          createApiResponse(false, null, 'Invalid email format', 400)
        );
      }

      // Send OTP
      const result = await otpService.sendOTP(email);

      console.log(`✅ OTP sent to: ${email}`);

      res.json(
        createApiResponse(true, null, 'OTP sent successfully')
      );

    } catch (error) {
      console.error('❌ Error in sendOTP:', error);
      res.status(500).json(
        createApiResponse(false, null, 'Failed to send OTP', 500)
      );
    }
  }

  /**
   * Verify OTP endpoint
   * POST /api/verify-otp
   */
  async verifyOTP(req, res) {
    try {
      logRequest(req, 'VERIFY_OTP');

      const { email, otp } = req.body;

      // Validate required fields
      const validation = validateRequiredFields(req.body, ['email', 'otp']);
      if (!validation.isValid) {
        return res.status(400).json(
          createApiResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`, 400)
        );
      }

      // Verify OTP
      const result = otpService.verifyOTP(email, otp);

      if (!result.isValid) {
        return res.status(400).json(
          createApiResponse(false, null, result.error, 400)
        );
      }

      console.log(`✅ Email verified: ${email}`);

      res.json(
        createApiResponse(true, { emailVerified: true }, result.message)
      );

    } catch (error) {
      console.error('❌ Error in verifyOTP:', error);
      res.status(500).json(
        createApiResponse(false, null, 'Failed to verify OTP', 500)
      );
    }
  }
}

module.exports = new OTPController();