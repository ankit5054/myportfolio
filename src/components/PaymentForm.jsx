import React, { useState } from 'react';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Download, Smartphone } from 'lucide-react';
import jsPDF from 'jspdf';
import logger from '../utils/logger';

const PaymentForm = ({ service, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [inrAmount, setInrAmount] = useState(Math.round(service.price * 92));
  const [usingFallbackRate, setUsingFallbackRate] = useState(false);

  // Fetch live exchange rate on component mount
  React.useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const rate = data.rates.INR;
        setInrAmount(Math.round(service.price * rate));
        setUsingFallbackRate(false);
      } catch (error) {
        console.error('Failed to fetch exchange rate, using fallback:', error);
        setUsingFallbackRate(true);
        // Keep default rate of 92
      }
    };
    fetchExchangeRate();
  }, [service.price]);

  const generateReceipt = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const transactionId = `TXN-${Date.now()}`;
    
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Services Invoice', 105, 30, { align: 'center' });
    
    // Business Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ankit Mishra - Full Stack Developer', 20, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Email: ankit.mishra9780@gmail.com', 20, 70);
    doc.text('Website: iamankit.in', 20, 78);
    
    // Receipt Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt Details:', 20, 100);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${currentDate.toLocaleDateString()}`, 20, 115);
    doc.text(`Time: ${currentDate.toLocaleTimeString()}`, 20, 125);
    doc.text(`Transaction ID: ${transactionId}`, 20, 135);
    
    // Service Details
    doc.setFont('helvetica', 'bold');
    doc.text('Service Information:', 20, 155);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Service: ${service.title}`, 20, 170);
    doc.text(`Duration: ${service.duration}`, 20, 180);
    
    if (service.bookingData) {
      doc.text(`Project: ${service.bookingData.projectTitle}`, 20, 190);
    }
    
    // Customer Info
    if (service.bookingData) {
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information:', 20, 210);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${service.bookingData.fullName}`, 20, 225);
      doc.text(`Email: ${service.bookingData.email}`, 20, 235);
    }
    
    // Payment Summary
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 250, 180, 25, 'F');
    
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SUMMARY', 20, 262);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ₹${inrAmount}`, 20, 270);
    
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(12);
    doc.text('PAID', 160, 270);
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated receipt. No signature required.', 105, 290, { align: 'center' });
    doc.text('Thank you for your business!', 105, 298, { align: 'center' });
    
    // Save PDF
    doc.save(`receipt-${service.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Store booking data in localStorage for order summary
      localStorage.setItem('bookingData', JSON.stringify(service.bookingData));
      localStorage.setItem('bookingService', JSON.stringify(service));

      // Add timeout for PhonePe API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('http://localhost:3001/api/create-phonepe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: inrAmount,
          serviceData: service,
          customerData: service.bookingData
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment request');
      }

      const responseData = await response.json();
      const { paymentUrl } = responseData.data || responseData;

      if (paymentUrl) {
        if (paymentUrl.startsWith('https://')) {
          // PhonePe official payment page
          window.location.href = paymentUrl;
        } else if (paymentUrl.startsWith('upi://')) {
          // UPI fallback
          alert(`PhonePe Payment\n\nUPI Link: ${paymentUrl}\n\nThis will open PhonePe or any UPI app on your device.`);
          window.location.href = paymentUrl;
          
          setTimeout(() => {
            if (window.confirm('Have you completed the payment? Click OK if payment is done.')) {
              setLoading(false);
              setSuccess(true);
            } else {
              setLoading(false);
            }
          }, 3000);
        }
      } else {
        throw new Error('No payment URL received');
      }

    } catch (err) {
      logger.error('Payment request failed', err, { 
        serviceTitle: service.title,
        amount: inrAmount,
        isTimeout: err.name === 'AbortError'
      });
      
      if (err.name === 'AbortError') {
        setError('Payment request timed out. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Payment failed. Please try again.');
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <span className="text-3xl">✓</span>
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-400 mb-6">Thank you for booking {service.title}. You'll receive a confirmation email shortly.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onBack} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all font-semibold"
          >
            Back to Services
          </button>
          
          <button 
            onClick={generateReceipt}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all font-semibold flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
        <p className="text-gray-400 mb-4">{service.duration}</p>
        <div className="text-3xl font-bold text-white">${service.price}</div>
        <div className="text-lg text-gray-400">
          (₹{inrAmount})
          {usingFallbackRate && (
            <div className="text-xs text-yellow-400 mt-1">
              *Using approximate rate due to connection error
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="bg-purple-900/20 border border-purple-700 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Smartphone className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="text-purple-300 font-medium mb-1">Quick & Secure</h4>
                <p className="text-purple-200 text-sm">
                  Click below to proceed with PhonePe UPI payment. You'll be redirected to complete the transaction securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl flex items-center justify-center transition-all font-semibold"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl flex flex-col items-center justify-center transition-all disabled:opacity-50 font-bold text-sm shadow-lg hover:shadow-purple-500/25 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-purple-600 font-black text-xs">₹</span>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-90 font-medium">Complete Payment</div>
                  <div className="text-lg font-black tracking-tight">{inrAmount}</div>
                </div>
              </div>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 flex items-center justify-center">
          <FaLock className="mr-2" />
          Secure payment powered by PhonePe
        </div>
      </form>
    </motion.div>
  );
};

export default PaymentForm;