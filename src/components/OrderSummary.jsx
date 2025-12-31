import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// eslint-disable-next-line no-unused-vars
import { Download, CheckCircle, Calendar, CreditCard, User, Mail, Phone, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

const OrderSummary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const txnId = searchParams.get('txnId');

  useEffect(() => {
    if (txnId) {
      fetchOrderDetails(txnId);
    } else {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnId]);

  const fetchOrderDetails = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment-status/${transactionId}`);
      const data = await response.json();
      
      if (data.success) {
        // Get booking data from localStorage
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        const serviceData = JSON.parse(localStorage.getItem('bookingService') || '{}');
        
        setOrderData({
          transactionId,
          orderId: data.data.orderId,
          amount: data.data.amount,
          state: data.data.state,
          timestamp: new Date().toISOString(),
          customer: bookingData,
          service: serviceData,
          paymentDetails: data.data.paymentDetails?.[0] || {}
        });

        // Send confirmation emails if payment is completed
        if (data.data.state === 'COMPLETED' && bookingData.email && serviceData.title) {
          try {
            await fetch('http://localhost:3001/api/send-confirmation-emails', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transactionId,
                bookingData: JSON.stringify(bookingData),
                serviceData: JSON.stringify(serviceData)
              })
            });
            console.log('Confirmation emails sent successfully');
          } catch (emailError) {
            console.error('Failed to send confirmation emails:', emailError);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    const currentDate = new Date(orderData.timestamp);
    
    // Header with gradient background effect
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Company logo area (placeholder)
    doc.setFillColor(255, 255, 255);
    doc.circle(25, 22, 12, 'F');
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AM', 25, 26, { align: 'center' });
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Services Invoice', 105, 32, { align: 'center' });
    
    // Business Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Ankit Mishra - Full Stack Developer', 20, 65);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Email: ankit.mishra9780@gmail.com', 20, 75);
    doc.text('Phone: +91 9876543210', 20, 82);
    doc.text('Website: iamankit.in', 20, 89);
    
    // Receipt number and date (right aligned)
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt #: ', 140, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(orderData.transactionId.substring(0, 8).toUpperCase(), 165, 65);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date: ', 140, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(currentDate.toLocaleDateString(), 155, 75);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Time: ', 140, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(currentDate.toLocaleTimeString(), 155, 82);
    
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 100, 190, 100);
    
    // Transaction Details Section
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION DETAILS', 20, 115);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const transactionY = 125;
    doc.text('Transaction ID:', 20, transactionY);
    doc.text(orderData.transactionId, 70, transactionY);
    
    doc.text('Order ID:', 20, transactionY + 8);
    doc.text(orderData.orderId, 70, transactionY + 8);
    
    doc.text('Payment Status:', 20, transactionY + 16);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
    doc.text(orderData.state, 70, transactionY + 16);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Method:', 20, transactionY + 24);
    doc.text('PhonePe UPI', 70, transactionY + 24);
    
    // Service Details Section
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE DETAILS', 20, 165);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const serviceY = 175;
    doc.text('Service:', 20, serviceY);
    doc.setFont('helvetica', 'bold');
    doc.text(orderData.service.title || 'Professional Service', 70, serviceY);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Duration:', 20, serviceY + 8);
    doc.text(orderData.service.duration || 'As per requirement', 70, serviceY + 8);
    
    doc.text('Description:', 20, serviceY + 16);
    const description = orderData.service.description || 'Professional development service';
    const splitDescription = doc.splitTextToSize(description, 120);
    doc.text(splitDescription, 70, serviceY + 16);
    
    // Customer Details Section
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 20, 210);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const customerY = 220;
    doc.text('Name:', 20, customerY);
    doc.text(orderData.customer.fullName || 'N/A', 70, customerY);
    
    doc.text('Email:', 20, customerY + 8);
    doc.text(orderData.customer.email || 'N/A', 70, customerY + 8);
    
    doc.text('Phone:', 20, customerY + 16);
    doc.text(orderData.customer.phone || 'N/A', 70, customerY + 16);
    
    if (orderData.customer.company) {
      doc.text('Company:', 20, customerY + 24);
      doc.text(orderData.customer.company, 70, customerY + 24);
    }
    
    // Payment Summary Box
    const summaryY = orderData.customer.company ? 255 : 247;
    doc.setFillColor(248, 250, 252);
    doc.rect(15, summaryY, 180, 25, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(15, summaryY, 180, 25, 'S');
    
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SUMMARY', 20, summaryY + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ₹${(orderData.amount / 100).toFixed(2)}`, 20, summaryY + 18);
    
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(12);
    doc.text('PAID', 160, summaryY + 18);
    
    // Footer
    const footerY = summaryY + 35;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated receipt. No signature required.', 105, footerY, { align: 'center' });
    doc.text('Thank you for choosing our services!', 105, footerY + 6, { align: 'center' });
    doc.text('For any queries, please contact: ankit.mishra9780@gmail.com', 105, footerY + 12, { align: 'center' });
    
    // Save PDF
    doc.save(`receipt-${orderData.transactionId}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-300">Your payment has been processed successfully</p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Order Summary</h2>
              <p className="text-gray-300">Transaction completed on {new Date(orderData.timestamp).toLocaleDateString()}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadReceipt}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Transaction Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Transaction ID:</span>
                  <span className="text-white font-mono text-sm">{orderData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Order ID:</span>
                  <span className="text-white font-mono text-sm">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-white font-semibold">₹{(orderData.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-green-400 font-semibold">{orderData.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Payment Method:</span>
                  <span className="text-white">PhonePe</span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Service Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-300 block">Service:</span>
                  <span className="text-white font-semibold">{orderData.service.title}</span>
                </div>
                <div>
                  <span className="text-gray-300 block">Price:</span>
                  <span className="text-white">₹{orderData.service.price}</span>
                </div>
                <div>
                  <span className="text-gray-300 block">Duration:</span>
                  <span className="text-white">{orderData.service.duration}</span>
                </div>
                <div>
                  <span className="text-gray-300 block">Description:</span>
                  <span className="text-white text-sm">{orderData.service.description}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 block">Name:</span>
                <span className="text-white">{orderData.customer.fullName}</span>
              </div>
              <div>
                <span className="text-gray-300 block">Email:</span>
                <span className="text-white">{orderData.customer.email}</span>
              </div>
              <div>
                <span className="text-gray-300 block">Phone:</span>
                <span className="text-white">{orderData.customer.phone}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 block">Company:</span>
                <span className="text-white">{orderData.customer.company || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-300 block">Project Title:</span>
                <span className="text-white">{orderData.customer.projectTitle}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
          <div className="space-y-3 text-gray-300">
            <p>• You will receive a confirmation email within 5 minutes</p>
            <p>• I will contact you within 24 hours to discuss project details</p>
            <p>• We'll schedule a kick-off meeting based on your preferences</p>
            <p>• Project work will begin as per the agreed timeline</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={downloadReceipt}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSummary;