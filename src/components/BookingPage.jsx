import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// eslint-disable-next-line no-unused-vars
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, Calendar, User, MessageSquare, Target, CreditCard, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import PaymentForm from './PaymentForm';
import SEO from './SEO';
import { countryCodes } from '../utils/countryCodes';

const BookingPage = () => {
  const selectStyles = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none !important;
    }
    .scrollbar-hide {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }
  `;
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service || JSON.parse(localStorage.getItem('bookingService') || 'null');
  
  useEffect(() => {
    if (service) {
      document.title = `Book ${service.title} - Ankit Mishra | Full Stack Developer`;
    }
  }, [service]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [emailVerified, setEmailVerified] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState(() => {
    // Try to restore form data from localStorage if returning from payment
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved booking data:', error);
      }
    }
    
    // Default form data
    return {
      // Personal Information
      fullName: 'Ankit',
      email: 'ankit.mishra2780@gmail.com',
      phone: '9786756453',
      company: '',
      role: '',
      
      // Project Details
      projectTitle: 'fvghbjn tfgvbh',
      projectDescription: 'esrdtfgy drftgybh',
      timeline: '',
      budget: '',
      urgency: 'normal',
      
      // Expectations & Requirements
      expectations: 'ftrdesw hvgfcdrs',
      specificRequirements: '',
      preferredMeetingTime: '',
      preferredDay: '',
      communicationPreference: 'email',
      
      // Additional Services
      additionalServices: [],
      followUpSessions: false
    };
  });
  
  // Redirect if no service data
  if (!service) {
    navigate('/');
    return null;
  }

  const steps = [
    { id: 1, title: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Project Details', icon: <Target className="w-5 h-5" /> },
    { id: 3, title: 'Expectations', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 4, title: 'Payment', icon: <CreditCard className="w-5 h-5" /> }
  ];

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 3) {
          newErrors.fullName = 'Full name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          newErrors.fullName = 'Full name can only contain letters and spaces';
        } else {
          delete newErrors.fullName;
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
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else {
          const cleanPhone = value.replace(/[\s()-]/g, '');
          if (!/^[+]?[1-9]\d{6,14}$/.test(cleanPhone)) {
            newErrors.phone = 'Please enter a valid international phone number (7-15 digits)';
          } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            newErrors.phone = 'Phone number must be between 7-15 digits';
          } else {
            delete newErrors.phone;
          }
        }
        break;
      case 'projectTitle':
        if (!value.trim()) {
          newErrors.projectTitle = 'Project title is required';
        } else if (value.trim().length < 3) {
          newErrors.projectTitle = 'Project title must be at least 3 characters';
        } else {
          delete newErrors.projectTitle;
        }
        break;
      case 'projectDescription':
        if (!value.trim()) {
          newErrors.projectDescription = 'Project description is required';
        } else if (value.trim().length < 10) {
          newErrors.projectDescription = 'Project description must be at least 10 characters';
        } else {
          delete newErrors.projectDescription;
        }
        break;
      case 'expectations':
        if (!value.trim()) {
          newErrors.expectations = 'Please describe your expectations';
        } else if (value.trim().length < 10) {
          newErrors.expectations = 'Please provide more detailed expectations (at least 10 characters)';
        } else {
          delete newErrors.expectations;
        }
        break;
      case 'specificRequirements':
        // Optional field, no validation needed
        delete newErrors.specificRequirements;
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Dynamic validation while typing
    validateField(field, value);
    
    // Reset email verification if email changes
    if (field === 'email') {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp('');
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Full name must be at least 3 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
        newErrors.fullName = 'Full name can only contain letters and spaces';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (!emailVerified) {
        newErrors.email = 'Please verify your email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else {
        const cleanPhone = formData.phone.replace(/[\s()-]/g, '');
        if (!/^[+]?[1-9]\d{6,14}$/.test(cleanPhone)) {
          newErrors.phone = 'Please enter a valid international phone number (7-15 digits)';
        } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
          newErrors.phone = 'Phone number must be between 7-15 digits';
        }
      }
    }
    
    if (step === 2) {
      if (!formData.projectTitle.trim()) {
        newErrors.projectTitle = 'Project title is required';
      } else if (formData.projectTitle.trim().length < 3) {
        newErrors.projectTitle = 'Project title must be at least 3 characters';
      }
      
      if (!formData.projectDescription.trim()) {
        newErrors.projectDescription = 'Project description is required';
      } else if (formData.projectDescription.trim().length < 10) {
        newErrors.projectDescription = 'Project description must be at least 10 characters';
      }
    }
    
    if (step === 3) {
      if (!formData.expectations.trim()) {
        newErrors.expectations = 'Please describe your expectations';
      } else if (formData.expectations.trim().length < 10) {
        newErrors.expectations = 'Please provide more detailed expectations (at least 10 characters)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const sendOTP = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
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
        body: JSON.stringify({ email: formData.email, otp })
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

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
            currentStep >= step.id 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-600 text-gray-400'
          }`}>
            {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.icon}
          </div>
          <div className="ml-2 mr-4 hidden sm:block">
            <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
              {step.title}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full bg-gray-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${
              errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full bg-gray-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${
              errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="your.email@example.com"
            disabled={emailVerified}
          />
          
          {!emailVerified && formData.email && (
            <button
              type="button"
              onClick={sendOTP}
              disabled={otpLoading}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all text-sm font-medium"
            >
              {otpLoading ? 'Sending OTP...' : otpSent ? 'Resend OTP' : 'Send Verification Code'}
            </button>
          )}
          
          {otpSent && !emailVerified && (
            <div className="mt-3">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full bg-gray-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-center text-lg tracking-widest ${
                  errors.otp ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
              <button
                type="button"
                onClick={verifyOTP}
                disabled={otpLoading || otp.length !== 6}
                className="w-full mt-2 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-all text-sm font-medium"
              >
                {otpLoading ? 'Verifying...' : 'Verify Email'}
              </button>
              {errors.otp && <p className="text-red-400 text-sm mt-1">{errors.otp}</p>}
            </div>
          )}
          
          {emailVerified && (
            <div className="mt-2 p-2 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400 text-sm text-center">
              ✓ Email verified successfully
            </div>
          )}
          
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
          <div className="flex w-full max-w-full overflow-hidden">
            <div className="relative flex-shrink-0">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-l-xl px-2 sm:px-3 py-3 text-white focus:outline-none focus:border-blue-500 pr-6 sm:pr-8 scrollbar-hide text-xs sm:text-sm min-w-0"
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
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`flex-1 min-w-0 bg-gray-700/50 border border-l-0 rounded-r-xl px-2 sm:px-3 py-3 text-white focus:outline-none transition-colors text-xs sm:text-sm ${
                errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
              }`}
              placeholder="123-456-7890"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company/Organization</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Your company name"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Role/Position</label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., CTO, Product Manager, Founder"
        />
      </div>
    </motion.div>
  );

  const renderProjectDetails = () => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Project Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
        <input
          type="text"
          required
          value={formData.projectTitle}
          onChange={(e) => handleInputChange('projectTitle', e.target.value)}
          className={`w-full bg-gray-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${
            errors.projectTitle ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
          }`}
          placeholder="Brief title for your project"
        />
        {errors.projectTitle && <p className="text-red-400 text-sm mt-1">{errors.projectTitle}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Description *</label>
        <textarea
          required
          rows={4}
          value={formData.projectDescription}
          onChange={(e) => handleInputChange('projectDescription', e.target.value)}
          className={`w-full bg-gray-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none resize-none transition-colors ${
            errors.projectDescription ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
          }`}
          placeholder="Describe your project, goals, and current challenges..."
        />
        {errors.projectDescription && <p className="text-red-400 text-sm mt-1">{errors.projectDescription}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Timeline</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'asap', label: 'ASAP (1 week)' },
            { value: '1-2weeks', label: '1-2 weeks' },
            { value: '1month', label: '1 month' },
            { value: '2-3months', label: '2-3 months' },
            { value: 'flexible', label: 'Flexible' }
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="timeline"
                value={option.value}
                checked={formData.timeline === option.value}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="sr-only"
              />
              <div className={`w-full p-3 rounded-lg border-2 text-center transition-all ${
                formData.timeline === option.value
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
              }`}>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Urgency</label>
        <div className="flex space-x-4">
          {['low', 'normal', 'high', 'urgent'].map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="urgency"
                value={level}
                checked={formData.urgency === level}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-300 capitalize">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderExpectations = () => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Expectations & Requirements</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">What are your expectations from this session? *</label>
        <textarea
          required
          rows={4}
          value={formData.expectations}
          onChange={(e) => handleInputChange('expectations', e.target.value)}
          className={`w-full bg-gray-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none resize-none transition-colors ${
            errors.expectations ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
          }`}
          placeholder="Describe what you hope to achieve, specific outcomes you're looking for..."
        />
        {errors.expectations && <p className="text-red-400 text-sm mt-1">{errors.expectations}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Specific Technical Requirements</label>
        <textarea
          rows={3}
          value={formData.specificRequirements}
          onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Any specific technologies, frameworks, or technical constraints..."
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Day</label>
          <select
            value={formData.preferredDay}
            onChange={(e) => handleInputChange('preferredDay', e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select preferred day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
            <option value="weekdays">Any Weekday</option>
            <option value="weekends">Any Weekend</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Meeting Time</label>
          <select
            value={formData.preferredMeetingTime}
            onChange={(e) => handleInputChange('preferredMeetingTime', e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select preferred time</option>
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 8 PM)</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Communication Preference</label>
        <select
          value={formData.communicationPreference}
          onChange={(e) => handleInputChange('communicationPreference', e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="email">Email</option>
          <option value="zoom">Zoom/Video Call</option>
          <option value="phone">Phone Call</option>
          <option value="slack">Slack</option>
        </select>
      </div>
    </motion.div>
  );

  const renderPayment = () => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
      <h3 className="text-2xl font-bold text-white mb-6">Complete Your Booking</h3>
      
      {/* Service Summary Card */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-white">{service.title}</h4>
            <p className="text-blue-300 text-sm">{service.duration} consultation</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${service.price}</div>
            <div className="text-sm text-gray-300">(₹899)</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Token Amount - First Session</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Non-refundable</span>
          </div>
        </div>
      </div>
      
      {/* What Happens Next */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          What Happens Next?
        </h4>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <span>Immediate booking confirmation via email</span>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <span>Meeting link & session details within 2 business days</span>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <span>Personal coordination for optimal session timing</span>
          </div>
        </div>
      </div>
      
      {/* Booking Summary */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Booking Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
          <div className="flex flex-col sm:block">
            <span className="text-gray-400">Name:</span>
            <span className="text-white sm:ml-2 break-words">{formData.fullName}</span>
          </div>
          <div className="flex flex-col sm:block">
            <span className="text-gray-400">Email:</span>
            <span className="text-white sm:ml-2 break-all">{formData.email}</span>
          </div>
          <div className="flex flex-col sm:block">
            <span className="text-gray-400">Project:</span>
            <span className="text-white sm:ml-2 break-words">{formData.projectTitle}</span>
          </div>
          <div className="flex flex-col sm:block">
            <span className="text-gray-400">Timeline:</span>
            <span className="text-white sm:ml-2">{formData.timeline || 'Flexible'}</span>
          </div>
        </div>
      </div>
      
      <PaymentForm 
        service={{...service, bookingData: formData}}
        onBack={() => setCurrentStep(3)}
      />
    </motion.div>
  );

  return (
    <>
      <style>{selectStyles}</style>
      <SEO 
        title={`Book ${service.title} - Ankit Mishra | Full Stack Developer`}
        description={`Book ${service.title} consultation with Ankit Mishra. ${service.duration} session for $${service.price}. Expert full stack development consultation.`}
        url={`https://iamankit.in/book/${serviceId}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16 sm:py-20 px-2 sm:px-4 overflow-x-hidden pb-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all px-4 py-2 rounded-xl mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words px-2">Book {service.title}</h1>
            <p className="text-gray-400">{service.duration} • ${service.price}</p>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderProjectDetails()}
          {currentStep === 3 && renderExpectations()}
          {currentStep === 4 && renderPayment()}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all"
              >
                Next Step
              </button>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Your information is secure and encrypted. We never store payment details.
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default BookingPage;