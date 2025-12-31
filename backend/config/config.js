/**
 * Configuration module for environment variables and application constants
 * Centralizes all configuration settings for easy management
 */

require('dotenv').config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },

  // Email configuration
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    service: 'gmail'
  },

  // Payment configuration
  payment: {
    defaultCurrency: 'usd',
    centMultiplier: 100 // Convert dollars to cents
  }
};

module.exports = config;