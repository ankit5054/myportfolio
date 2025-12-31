/**
 * Email Service Module
 * Handles all email-related operations including sending confirmations and notifications
 */

const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    // Initialize email transporter with Gmail configuration
    this.transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  /**
   * Generate HTML template for customer confirmation email
   * @param {Object} customerData - Customer information
   * @param {Object} serviceData - Service details
   * @returns {string} HTML email template
   */
  generateCustomerEmailTemplate(customerData, serviceData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Your Journey!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing professional development consultation</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${customerData.fullName},</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">🎉 <strong>Congratulations!</strong> You've successfully booked <strong>${serviceData.title}</strong>. I'm excited to work with you and help bring your project vision to life!</p>
          
          <!-- Service Details -->
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">📋 Your Booking Details</h3>
            <div style="display: grid; gap: 10px;">
              <div><strong style="color: #374151;">Service:</strong> <span style="color: #6b7280;">${serviceData.title}</span></div>
              <div><strong style="color: #374151;">Duration:</strong> <span style="color: #6b7280;">${serviceData.duration}</span></div>
              <div><strong style="color: #374151;">Investment:</strong> <span style="color: #059669; font-weight: bold;">$${serviceData.price}</span></div>
              <div><strong style="color: #374151;">Project:</strong> <span style="color: #6b7280;">${customerData.projectTitle}</span></div>
            </div>
          </div>

          <!-- What You Get -->
          <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">🚀 What You'll Get</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.8;">
              <li><strong>Expert Consultation:</strong> Personalized guidance from a full-stack developer with 5+ years experience</li>
              <li><strong>Technical Roadmap:</strong> Clear, actionable steps to achieve your project goals</li>
              <li><strong>Best Practices:</strong> Industry-standard approaches and modern development techniques</li>
              <li><strong>Resource Recommendations:</strong> Tools, frameworks, and technologies tailored to your needs</li>
              <li><strong>Follow-up Support:</strong> Post-session email summary and additional resources</li>
            </ul>
          </div>

          <!-- Next Steps -->
          <div style="background: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">⏰ What Happens Next</h3>
            <div style="color: #4b5563; line-height: 1.8;">
              <p style="margin: 0 0 10px 0;">📧 <strong>Within 2 business days:</strong> I'll personally reach out to schedule our session at your preferred time</p>
              <p style="margin: 0 0 10px 0;">🔗 <strong>Meeting details:</strong> You'll receive a calendar invite with Zoom/Google Meet link</p>
              <p style="margin: 0 0 10px 0;">📝 <strong>Preparation:</strong> I'll send a brief questionnaire to maximize our session effectiveness</p>
              <p style="margin: 0;">💡 <strong>Session summary:</strong> Post-meeting recap with actionable insights and resources</p>
            </div>
          </div>

          <!-- About Me -->
          <div style="background: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">👨‍💻 About Your Consultant</h3>
            <p style="color: #4b5563; line-height: 1.6; margin: 0;">Hi! I'm <strong>Ankit Mishra</strong>, a passionate full-stack developer specializing in React, Node.js, Python, and modern web technologies. I've helped 50+ clients transform their ideas into successful digital products. My approach combines technical expertise with practical business insights to deliver solutions that actually work.</p>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; margin: 0 0 15px 0;">Questions? I'm here to help!</p>
            <p style="margin: 0;">
              <a href="mailto:ankit.mishra9780@gmail.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">📧 ankit.mishra9780@gmail.com</a><br>
              <a href="https://iamankit.in" style="color: #2563eb; text-decoration: none; font-weight: 500;">🌐 iamankit.in</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">Thank you for choosing professional development consultation!</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">This is an automated confirmation. Please save this email for your records.</p>
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML template for business notification email
   * @param {Object} customerData - Customer information
   * @param {Object} serviceData - Service details
   * @returns {string} HTML email template
   */
  generateNotificationEmailTemplate(customerData, serviceData) {
    const urgencyColors = {
      low: '#10b981',
      normal: '#3b82f6', 
      high: '#f59e0b',
      urgent: '#ef4444'
    };
    
    const urgencyColor = urgencyColors[customerData.urgency] || '#3b82f6';
    const totalRevenue = serviceData.price;
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">📨 New Booking Alert!</h1>
          <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 14px;">A new client has booked your consultation service</p>
        </div>

        <!-- Quick Stats -->
        <div style="background: #f8fafc; padding: 20px; display: flex; justify-content: space-around; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${totalRevenue}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Revenue</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: ${urgencyColor};">${customerData.urgency?.toUpperCase() || 'NORMAL'}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Priority</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${serviceData.title.split(' ')[0]}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Service</div>
          </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 25px;">
          
          <!-- Customer Profile -->
          <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-size: 20px; font-weight: bold;">${customerData.fullName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 style="margin: 0; color: #1f2937; font-size: 20px;">${customerData.fullName}</h2>
                <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">${customerData.role || 'Professional'} ${customerData.company ? `at ${customerData.company}` : ''}</p>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
              <div style="background: #f3f4f6; padding: 12px; border-radius: 6px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Email</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.email}</div>
              </div>
              <div style="background: #f3f4f6; padding: 12px; border-radius: 6px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Phone</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.phone}</div>
              </div>
            </div>
          </div>

          <!-- Service & Financial Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px;">
              <h3 style="margin: 0 0 12px 0; color: #065f46; font-size: 16px; display: flex; align-items: center;">
                💼 Service Booked
              </h3>
              <div style="color: #047857; line-height: 1.6;">
                <div><strong>${serviceData.title}</strong></div>
                <div style="font-size: 14px; color: #059669; margin-top: 4px;">${serviceData.duration}</div>
                ${serviceData.originalPrice ? `<div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Original: $${serviceData.originalPrice} <span style="color: #dc2626;">(${Math.round((1 - serviceData.price/serviceData.originalPrice) * 100)}% off)</span></div>` : ''}
              </div>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px;">
              <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; display: flex; align-items: center;">
                💰 Payment Details
              </h3>
              <div style="color: #b45309; line-height: 1.6;">
                <div style="font-size: 24px; font-weight: bold; color: #059669;">$${serviceData.price}</div>
                <div style="font-size: 12px; color: #6b7280;">Payment completed successfully</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Transaction ID: TXN-${Date.now()}</div>
              </div>
            </div>
          </div>

          <!-- Project Information -->
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; display: flex; align-items: center;">
              🚀 Project: ${customerData.projectTitle}
            </h3>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 12px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Description</div>
              <div style="color: #374151; line-height: 1.5;">${customerData.projectDescription}</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div style="background: white; padding: 12px; border-radius: 6px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Timeline</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.timeline || 'Not specified'}</div>
              </div>
              <div style="background: white; padding: 12px; border-radius: 6px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Urgency</div>
                <div style="color: ${urgencyColor}; font-weight: 500; text-transform: capitalize;">${customerData.urgency || 'Normal'}</div>
              </div>
            </div>
          </div>

          <!-- Client Expectations -->
          <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #7c2d12; font-size: 16px; display: flex; align-items: center;">
              🎯 Client Expectations
            </h3>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 12px;">
              <div style="color: #374151; line-height: 1.6;">${customerData.expectations}</div>
            </div>
            
            ${customerData.specificRequirements ? `
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Technical Requirements</div>
              <div style="color: #374151; line-height: 1.5;">${customerData.specificRequirements}</div>
            </div>
            ` : ''}
          </div>

          <!-- Meeting Preferences -->
          <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 16px; display: flex; align-items: center;">
              📅 Meeting Preferences
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div style="background: white; padding: 12px; border-radius: 6px; text-align: center;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Preferred Day</div>
                <div style="color: #1f2937; font-weight: 500; text-transform: capitalize;">${customerData.preferredDay || 'Flexible'}</div>
              </div>
              <div style="background: white; padding: 12px; border-radius: 6px; text-align: center;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Time Slot</div>
                <div style="color: #1f2937; font-weight: 500; text-transform: capitalize;">${customerData.preferredMeetingTime || 'Flexible'}</div>
              </div>
              <div style="background: white; padding: 12px; border-radius: 6px; text-align: center;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Platform</div>
                <div style="color: #1f2937; font-weight: 500; text-transform: capitalize;">${customerData.communicationPreference || 'Email'}</div>
              </div>
            </div>
          </div>

          <!-- Action Items -->
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #991b1b; font-size: 16px; display: flex; align-items: center;">
              ✅ Next Actions Required
            </h3>
            
            <div style="color: #7f1d1d; line-height: 1.8;">
              <div style="margin-bottom: 8px;">• <strong>Send calendar invite</strong> within 2 business days</div>
              <div style="margin-bottom: 8px;">• <strong>Prepare session agenda</strong> based on project requirements</div>
              <div style="margin-bottom: 8px;">• <strong>Review client expectations</strong> and technical requirements</div>
              <div style="margin-bottom: 8px;">• <strong>Send pre-session questionnaire</strong> if needed</div>
              ${customerData.followUpSessions ? '<div>• <strong>Note:</strong> Client interested in follow-up sessions at discounted rates</div>' : ''}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">New booking notification from iamankit.in</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">Booking received at ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  }

  /**
   * Send confirmation email to customer
   * @param {Object} customerData - Customer information
   * @param {Object} serviceData - Service details
   * @returns {Promise} Email sending promise
   */
  async sendCustomerConfirmation(customerData, serviceData) {
    console.log('DEBUG: Customer email for confirmation:', customerData.email);
    
    const emailOptions = {
      from: config.email.user,
      to: customerData.email,
      subject: `Booking Confirmation - ${serviceData.title}`,
      html: this.generateCustomerEmailTemplate(customerData, serviceData)
    };

    return await this.transporter.sendMail(emailOptions);
  }

  /**
   * Send notification email to business owner
   * @param {Object} customerData - Customer information
   * @param {Object} serviceData - Service details
   * @returns {Promise} Email sending promise
   */
  async sendBusinessNotification(customerData, serviceData) {
    const emailOptions = {
      from: config.email.user,
      to: config.email.user,
      subject: `New Booking: ${serviceData.title} - ${customerData.fullName}`,
      html: this.generateNotificationEmailTemplate(customerData, serviceData)
    };

    return await this.transporter.sendMail(emailOptions);
  }

  /**
   * Send OTP email for verification
   * @param {string} email - Email address
   * @param {string} otp - OTP code
   * @returns {Promise} Email sending promise
   */
  async sendOTPEmail(email, otp) {
    const emailOptions = {
      from: config.email.user,
      to: email,
      subject: 'Verify Your Email - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔐 Email Verification</h1>
          </div>
          
          <div style="padding: 30px; text-align: center;">
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">Please use this code to verify your email address:</p>
            
            <div style="background: #f3f4f6; border: 2px dashed #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 4px;">${otp}</div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
          
          <div style="background: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">Ankit Mishra - Full Stack Developer</p>
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(emailOptions);
  }
  /**
   * Generate HTML template for payment failure notification email
   * @param {Object} customerData - Customer information
   * @param {Object} serviceData - Service details
   * @param {string} reason - Failure reason
   * @param {string} transactionId - Transaction ID
   * @returns {string} HTML email template
   */
  generatePaymentFailureEmailTemplate(customerData, serviceData, reason, transactionId) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">⚠️ Payment Issue Alert</h1>
          <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 14px;">Payment failed or pending for consultation booking</p>
        </div>

        <!-- Alert Stats -->
        <div style="background: #fef2f2; padding: 20px; border-bottom: 1px solid #fecaca;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center;">
            <div>
              <div style="font-size: 18px; font-weight: bold; color: #dc2626;">FAILED</div>
              <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase;">Status</div>
            </div>
            <div>
              <div style="font-size: 18px; font-weight: bold; color: #059669;">$${serviceData.price}</div>
              <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase;">Amount</div>
            </div>
            <div>
              <div style="font-size: 18px; font-weight: bold; color: #3b82f6;">${new Date().toLocaleDateString()}</div>
              <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase;">Date</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 25px;">
          
          <!-- Failure Details -->
          <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #991b1b; font-size: 18px; display: flex; align-items: center;">
              🚨 Payment Failure Details
            </h3>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Transaction ID</div>
              <div style="color: #1f2937; font-family: monospace; font-size: 14px;">${transactionId}</div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Failure Reason</div>
              <div style="color: #dc2626; font-weight: 500;">${reason}</div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Timestamp</div>
              <div style="color: #1f2937;">${new Date().toLocaleString()}</div>
            </div>
          </div>

          <!-- Customer Details -->
          <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">👤 Customer Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Name</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.fullName}</div>
              </div>
              <div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Email</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.email}</div>
              </div>
              <div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Phone</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.phone}</div>
              </div>
              <div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Company</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.company || 'N/A'}</div>
              </div>
            </div>
          </div>

          <!-- Service Details -->
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">💼 Service Details</h3>
            
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">${serviceData.title}</div>
              <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">${serviceData.duration}</div>
              <div style="color: #059669; font-weight: bold; font-size: 18px;">$${serviceData.price}</div>
            </div>
          </div>

          <!-- Project Information -->
          <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">🚀 Project: ${customerData.projectTitle}</h3>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 12px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Description</div>
              <div style="color: #374151; line-height: 1.5;">${customerData.projectDescription}</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div style="background: white; padding: 12px; border-radius: 6px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Timeline</div>
                <div style="color: #1f2937; font-weight: 500;">${customerData.timeline || 'Not specified'}</div>
              </div>
              <div style="background: white; padding: 12px; border-radius: 6px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Urgency</div>
                <div style="color: #f59e0b; font-weight: 500; text-transform: capitalize;">${customerData.urgency || 'Normal'}</div>
              </div>
            </div>
          </div>

          <!-- Next Actions -->
          <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 16px;">📋 Recommended Actions</h3>
            
            <div style="color: #0369a1; line-height: 1.8;">
              <div style="margin-bottom: 8px;">• <strong>Contact customer</strong> within 2 hours to assist with payment</div>
              <div style="margin-bottom: 8px;">• <strong>Offer alternative payment methods</strong> if needed</div>
              <div style="margin-bottom: 8px;">• <strong>Check PhonePe dashboard</strong> for detailed error information</div>
              <div style="margin-bottom: 8px;">• <strong>Follow up</strong> if customer doesn't respond within 24 hours</div>
              <div>• <strong>Consider offering discount</strong> for the inconvenience</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">Payment failure notification from iamankit.in</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">Alert generated at ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  }
  /**
   * Send payment failure notification email to business owner
   * @param {Object} customerData - Customer information
   * @param {Object} serviceData - Service details
   * @param {string} reason - Failure reason
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} Email sending promise
   */
  async sendPaymentFailureNotification(customerData, serviceData, reason, transactionId) {
    const emailOptions = {
      from: config.email.user,
      to: config.email.user,
      subject: `⚠️ Payment Failed: ${serviceData.title} - ${customerData.fullName}`,
      html: this.generatePaymentFailureEmailTemplate(customerData, serviceData, reason, transactionId)
    };

    return await this.transporter.sendMail(emailOptions);
  }

  /**
   * Send contact message email
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Email sending promise
   */
  async sendContactMessage(contactData) {
    const emailOptions = {
      from: config.email.user,
      to: config.email.user,
      subject: `New Contact Message from ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">📧 New Contact Message</h1>
            <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Someone reached out through your portfolio</p>
          </div>
          
          <div style="padding: 25px;">
            <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">👤 Contact Information</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Name</div>
                  <div style="color: #1f2937; font-weight: 500;">${contactData.name}</div>
                </div>
                <div>
                  <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Email</div>
                  <div style="color: #1f2937; font-weight: 500;">${contactData.email}</div>
                </div>
              </div>
            </div>
            
            <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">💬 Message</h3>
              <div style="background: white; padding: 15px; border-radius: 6px;">
                <div style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</div>
              </div>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">Contact message from iamankit.in</p>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">Received at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(emailOptions);
  }
}

module.exports = new EmailService();

module.exports = new EmailService();