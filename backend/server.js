/**
 * Main Server File
 * Entry point for the payment API server with modular architecture
 */

const express = require('express');
const config = require('./config/config');
const { setupMiddleware } = require('./middleware');
const routes = require('./routes');
const { setupErrorHandling } = require('./middleware/errorHandler');
const { startServer } = require('./utils/server');

// Initialize Express application
const app = express();
const PORT = config.server.port;

// Setup middleware
setupMiddleware(app);

// Setup routes
app.use('/api', routes);
app.use('/', routes);

// Setup error handling
setupErrorHandling(app);

// Start server
startServer(app, PORT);