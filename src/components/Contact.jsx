import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Shield, CheckCircle, ChevronDown } from "lucide-react";
import { countryCodes } from '../utils/countryCodes';

function Contact() {
  const selectStyles = `
    select.scrollbar-hide option {
      padding: 8px;
    }
    select.scrollbar-hide::-webkit-scrollbar {
      display: none !important;
    }
    select.scrollbar-hide {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }
    @supports (-webkit-appearance: none) {
      select.scrollbar-hide {
        max-height: 150px !important;
      }
    }
  `;
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState('+91');
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          newErrors.name = 'Name can only contain letters and spaces';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value.trim()) {
          const cleanPhone = value.replace(/[\s()-]/g, '');
          if (!/^[+]?[1-9]\d{6,14}$/.test(cleanPhone)) {
            newErrors.phone = 'Please enter a valid international phone number (7-15 digits)';
          } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            newErrors.phone = 'Phone number must be between 7-15 digits';
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else {
          delete newErrors.message;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone if provided
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s()-]/g, '');
      if (!/^[+]?[1-9]\d{6,14}$/.test(cleanPhone)) {
        setErrors(prev => ({ ...prev, phone: 'Please enter a valid international phone number (7-15 digits)' }));
        return;
      } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        setErrors(prev => ({ ...prev, phone: 'Phone number must be between 7-15 digits' }));
        return;
      }
    }
    
    if (!emailVerified || !name.trim() || !message.trim()) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch('http://localhost:3001/api/send-contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });

      if (response.ok) {
        setSent(true);
        setName('');
        setPhone('');
        setMessage('');
        setEmail('');
        setEmailVerified(false);
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, submit: errorData.message || 'Failed to send message' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Failed to send message' }));
    }
    setSending(false);
  };

  const sendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setOtpSent(true);
        setErrors(prev => ({ ...prev, email: '' }));
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, email: errorData.message || 'Failed to send OTP' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, email: 'Failed to send OTP' }));
    }
    setOtpLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter 6-digit OTP' }));
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      if (response.ok) {
        setEmailVerified(true);
        setOtpSent(false);
        setOtp('');
        setErrors(prev => ({ ...prev, otp: '', email: '' }));
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, otp: errorData.message || 'Invalid OTP' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, otp: 'Failed to verify OTP' }));
    }
    setOtpLoading(false);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "ankit.mishra9780@gmail.com",
      link: "mailto:ankit.mishra9780@gmail.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "India",
      link: null
    }
  ];

  return (
    <>
      <style>{selectStyles}</style>
      <div name="Contact" className="py-16 sm:py-20 px-2 sm:px-4 min-h-screen flex items-center overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 px-2 break-words">
            Let's <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">Connect</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed">
            Ready to discuss your next project? I'd love to hear from you and explore how we can work together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 px-2 sm:px-4 lg:px-0"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Get in Touch</h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Whether you have a project in mind, need technical consultation, or just want to say hello, 
                I'm always excited to connect with fellow developers and potential collaborators.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 justify-center lg:justify-start"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="text-center lg:text-left">
                    <h4 className="text-white font-semibold text-sm sm:text-base">{info.title}</h4>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        className="text-gray-400 hover:text-blue-400 transition-colors text-sm sm:text-base break-all"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6 max-w-lg mx-auto lg:mx-0">
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Quick Response</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                I typically respond to messages within 24 hours. For urgent inquiries, 
                feel free to reach out via phone or LinkedIn.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-3 sm:p-4 lg:p-6 order-1 lg:order-2 mx-2 sm:mx-4 lg:mx-0 w-full max-w-full"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">Send a Message</h3>
            </div>

            <form 
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 lg:space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateField('name', e.target.value);
                  }}
                  placeholder="Enter your full name"
                  className={`w-full bg-gray-700/50 border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex w-full max-w-full overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded-l-xl px-2 sm:px-3 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 pr-6 sm:pr-8 text-xs sm:text-sm scrollbar-hide min-w-0"
                      style={{ 
                        appearance: 'none', 
                        WebkitAppearance: 'none', 
                        MozAppearance: 'none',
                        backgroundImage: 'none',
                        WebkitBackgroundImage: 'none',
                        MozBackgroundImage: 'none',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      validateField('phone', e.target.value);
                    }}
                    placeholder="123-456-7890"
                    className={`flex-1 min-w-0 bg-gray-700/50 border border-l-0 rounded-r-xl px-2 sm:px-3 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none transition-colors text-xs sm:text-sm ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField('email', e.target.value);
                    }}
                    placeholder="your.email@example.com"
                    className={`w-full bg-gray-700/50 border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                  />
                  {emailVerified && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  )}
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                
                {!emailVerified && (
                  <div className="mt-3">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={otpLoading || !email}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                      >
                        {otpLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Shield className="w-4 h-4 mr-2" />
                        )}
                        Verify Email
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                          <p className="text-blue-300 text-sm">OTP sent to {email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className={`flex-1 bg-gray-700/50 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none transition-colors text-sm ${
                              errors.otp ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={otpLoading || otp.length !== 6}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            {otpLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              'Verify'
                            )}
                          </button>
                        </div>
                        {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}
                      </div>
                    )}
                  </div>
                )}
                
                {emailVerified && (
                  <div className="mt-2 flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Email verified successfully
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea 
                  required 
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    validateField('message', e.target.value);
                  }}
                  placeholder="Tell me about your project or how I can help you..."
                  className={`w-full bg-gray-700/50 border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none transition-colors resize-none text-sm sm:text-base ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              {errors.submit && (
                <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {errors.submit}
                </div>
              )}

              {sent && (
                <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              <button 
                type="submit"
                disabled={!emailVerified || sending || !name.trim() || !message.trim()}
                className={`w-full font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
                  emailVerified && name.trim() && message.trim() && !sending
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {emailVerified && name.trim() && message.trim() ? 'Send Message' : 'Complete Form to Send'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Contact;