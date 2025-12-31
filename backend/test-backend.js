// Simple test to check if backend is running
// Run this in browser console or create a test page

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test payment intent creation
    const testData = {
      amount: 50,
      serviceData: {
        id: 1,
        title: 'Test Service',
        price: 50
      },
      customerData: {
        fullName: 'Test User',
        email: 'test@example.com',
        projectTitle: 'Test Project'
      }
    };
    
    const paymentResponse = await fetch('http://localhost:3001/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const paymentData = await paymentResponse.json();
    console.log('✅ Payment intent test:', paymentData);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error);
    console.log('Make sure backend is running: cd backend && npm run dev');
  }
}

// Run the test
testBackend();