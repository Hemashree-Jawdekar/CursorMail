const jwt = require('jsonwebtoken');
const http = require('http');

async function testEndpoint() {
  try {
    console.log('Testing profile data endpoint...');
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set!');
      return;
    }
    
    // Create a test token (you'll need to replace with a real user ID)
    const testUserId = 3; // Using the user ID from the database test
    const testUsername = 'hemashree'; // Using the username from the database test
    
    const token = jwt.sign(
      { id: testUserId, username: testUsername }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    console.log('✅ Test token created');
    
    // Test the endpoint using http module
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/profile/data',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      console.log('Response status:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ Endpoint working! Response:', jsonData);
          } else {
            console.log('❌ Endpoint failed:', jsonData);
          }
        } catch (error) {
          console.log('❌ Failed to parse response:', data);
        }
        process.exit(0);
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      process.exit(1);
    });

    req.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testEndpoint(); 