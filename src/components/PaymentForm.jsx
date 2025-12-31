import React, { useState } from 'react';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Download, Smartphone } from 'lucide-react';
import jsPDF from 'jspdf';

const PaymentForm = ({ service, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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
    doc.rect(15, 250, 180, 30, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Summary:', 20, 265);
    
    if (service.originalPrice) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Original Price: $${service.originalPrice}`, 20, 275);
      doc.setTextColor(34, 197, 94);
      doc.text(`Discount Applied`, 120, 275);
      doc.setTextColor(0, 0, 0);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Total Amount: $${service.price}`, 120, 265);
    
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

      const response = await fetch('http://localhost:3001/api/create-phonepe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: service.price * 100,
          serviceData: service,
          customerData: service.bookingData
        })
      });

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
      setError(err.message || 'Payment failed. Please try again.');
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
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">PhonePe Payment</h4>
                <p className="text-gray-400">Secure UPI Payment Gateway</p>
              </div>
            </div>
          </div>

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

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl flex items-center justify-center transition-all font-semibold"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 font-semibold"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Smartphone className="mr-2" /> Pay with PhonePe ${service.price}
              </>
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