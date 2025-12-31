import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const txnId = searchParams.get('txnId');
  const maxRetries = 10; // Check for 50 seconds (10 * 5 seconds)

  useEffect(() => {
    if (txnId) {
      checkPaymentStatus(txnId);
    } else {
      setPaymentStatus('failed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnId]);

  // Countdown timer for successful payments
  useEffect(() => {
    if (paymentStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (paymentStatus === 'success' && countdown === 0) {
      navigate(`/order-summary?txnId=${txnId}`);
    }
  }, [paymentStatus, countdown, navigate, txnId]);

  const sendFailureNotification = async (transactionId, reason) => {
    try {
      const bookingData = localStorage.getItem('bookingData');
      const serviceData = localStorage.getItem('bookingService');
      
      if (bookingData && serviceData) {
        // Check if we already sent notification for this transaction
        const notificationSent = localStorage.getItem(`notification_${transactionId}`);
        if (notificationSent) {
          return; // Already sent, don't send again
        }
        
        await fetch('http://localhost:3001/api/send-failure-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId,
            reason,
            bookingData,
            serviceData
          })
        });
        
        // Mark as sent
        localStorage.setItem(`notification_${transactionId}`, 'true');
      }
    } catch (error) {
      console.error('Failed to send failure notification:', error);
    }
  };

  const checkPaymentStatus = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment-status/${transactionId}`);
      const data = await response.json();
      
      if (data.success) {
        const state = data.data.state;
        
        if (state === 'COMPLETED') {
          setPaymentStatus('success');
        } else if (state === 'FAILED') {
          setPaymentStatus('failed');
          // Send failure notification
          sendFailureNotification(transactionId, 'Payment failed at gateway');
        } else if (state === 'PENDING' && retryCount < maxRetries) {
          // Keep checking for pending payments
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkPaymentStatus(transactionId);
          }, 5000); // Check every 5 seconds
        } else {
          // Max retries reached or unknown state
          setPaymentStatus('timeout');
          sendFailureNotification(transactionId, 'Payment timeout - exceeded maximum retry attempts');
        }
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          checkPaymentStatus(transactionId);
        }, 5000);
      } else {
        setPaymentStatus('failed');
      }
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    // Clear the payment success URL and go back to booking with service data
    const serviceData = JSON.parse(localStorage.getItem('bookingService') || '{}');
    if (serviceData.id) {
      navigate(`/book/${serviceData.id}`, { state: { service: serviceData } });
    } else {
      navigate('/');
    }
  };

  if (paymentStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Checking Payment Status...</h2>
          <p className="text-gray-300">Please wait while we verify your payment</p>
          <p className="text-sm text-gray-400 mt-2">Attempt {retryCount + 1} of {maxRetries + 1}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20"
      >
        {paymentStatus === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-4">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Transaction ID: {txnId}
            </p>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
                Redirecting to order summary in {countdown} seconds...
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </>
        ) : paymentStatus === 'timeout' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Pending</h1>
            <p className="text-gray-300 mb-6">
              Your payment is taking longer than expected. Please check your payment app or try again.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Transaction ID: {txnId}
            </p>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetryPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoHome}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Back to Home
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
            <p className="text-gray-300 mb-6">
              Your payment could not be processed. Please try again or contact support.
            </p>
            {txnId && (
              <p className="text-sm text-gray-400 mb-6">
                Transaction ID: {txnId}
              </p>
            )}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetryPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoHome}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Back to Home
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;