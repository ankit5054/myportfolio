const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const express = require('express');
const config = require('../config/config');
const logger = require('../utils/logger');

// Rate limiting configurations
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 payment requests per windowMs
  message: 'Too many payment requests, please try again later.',
});

const setupMiddleware = (app) => {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for API
    crossOriginEmbedderPolicy: false
  }));

  // Compression middleware
  app.use(compression());

  // Rate limiting
  app.use(limiter);

  // Enable CORS for frontend communication
  app.use(cors({
    origin: config.server.frontendUrl,
    credentials: true
  }));

  // Parse JSON requests (except for webhook endpoint)
  app.use('/api/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info({ method: req.method, path: req.path, ip: req.ip }, 'Incoming request');
    next();
  });
};

module.exports = { setupMiddleware, paymentLimiter };