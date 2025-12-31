# Portfolio Payment Backend API - Modular Architecture

## 📁 Project Structure

```
backend/
├── config/
│   └── config.js              # Environment variables and app configuration
├── controllers/
│   └── paymentController.js   # HTTP request handlers for payment routes
├── services/
│   ├── emailService.js        # Email operations (confirmations, notifications)
│   └── paymentService.js      # Stripe payment operations
├── utils/
│   └── helpers.js             # Utility functions (validation, error handling)
├── server.js                  # Main server file with routes and middleware
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
└── README.md                  # This file
```

## 🏗️ Architecture Overview

### **Modular Design Benefits:**
- **Separation of Concerns**: Each module has a specific responsibility
- **Maintainability**: Easy to update and debug individual components
- **Testability**: Each module can be tested independently
- **Scalability**: Easy to add new features without affecting existing code

### **Module Descriptions:**

#### **1. Configuration (`config/config.js`)**
- Centralizes all environment variables
- Provides default values for development
- Easy to manage different environments (dev, staging, prod)

#### **2. Controllers (`controllers/paymentController.js`)**
- Handles HTTP requests and responses
- Validates input data
- Coordinates between services
- Returns standardized API responses

#### **3. Services (`services/`)**
- **PaymentService**: All Stripe-related operations
- **EmailService**: Email template generation and sending
- Business logic separated from HTTP handling

#### **4. Utilities (`utils/helpers.js`)**
- Validation functions
- Error handling utilities
- Common helper functions
- Logging and debugging tools

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Update `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server Configuration
PORT=3001
FRONTEND_URL=https://iamankit.in

# Email Configuration
EMAIL_USER=ankit.mishra9780@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use generated password in `EMAIL_PASS`

### 4. Stripe Setup
1. Get live secret key from Stripe Dashboard
2. Create webhook: `https://your-domain.com/api/webhook`
3. Add events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 5. Run the Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## 📡 API Endpoints

| Method | Endpoint | Description | Controller Method |
|--------|----------|-------------|-------------------|
| POST | `/api/create-payment-intent` | Create Stripe payment intent | `createPaymentIntent` |
| POST | `/api/confirm-payment` | Verify payment & send emails | `confirmPayment` |
| POST | `/api/webhook` | Handle Stripe webhook events | `handleWebhook` |
| GET | `/api/health` | API health check | `healthCheck` |
| GET | `/` | API information | Root handler |

## 🔧 Code Features

### **Error Handling**
- Async error wrapper (`asyncHandler`)
- Standardized error responses
- Detailed logging with timestamps
- Graceful error recovery

### **Validation**
- Required field validation
- Email format validation
- Amount validation with limits
- Nested object validation support

### **Security**
- Stripe webhook signature verification
- CORS configuration
- Input sanitization
- Sensitive data masking in logs

### **Logging**
- Request/response logging
- Payment status tracking
- Error logging with context
- Sanitized customer data in logs

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Create payment intent
curl -X POST http://localhost:3001/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 50, "serviceData": {...}, "customerData": {...}}'
```

### Adding Unit Tests
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 🚀 Deployment

### Environment Setup
1. **Heroku**: `heroku config:set STRIPE_SECRET_KEY=sk_live_...`
2. **Vercel**: Add environment variables in dashboard
3. **Railway**: Configure in project settings

### Production Checklist
- [ ] Update all environment variables
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Configure Stripe webhook URL
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Test payment flow end-to-end

## 📊 Monitoring

### Logs to Monitor
- Payment intent creation success/failure
- Email delivery status
- Webhook event processing
- API response times
- Error rates and types

### Health Metrics
- Server uptime
- Memory usage
- Response times
- Payment success rates
- Email delivery rates

## 🔄 Future Enhancements

### Potential Additions
- Database integration for transaction storage
- Rate limiting for API endpoints
- Caching for improved performance
- Automated testing suite
- API documentation with Swagger
- Metrics and analytics dashboard
- Multi-currency support
- Subscription billing support

## 🐛 Troubleshooting

### Common Issues
1. **Stripe webhook fails**: Check webhook secret and URL
2. **Emails not sending**: Verify Gmail app password
3. **CORS errors**: Check frontend URL configuration
4. **Payment intent fails**: Validate Stripe secret key

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and stack traces.