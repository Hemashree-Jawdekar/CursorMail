const jwt = require('jsonwebtoken');
const db = require('./db');

async function testAuth() {
  try {
    console.log('Testing JWT authentication...');
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set!');
      return;
    }
    console.log('✅ JWT_SECRET is set');
    
    // Get a test user
    const [users] = await db.query('SELECT id, username FROM users LIMIT 1');
    if (users.length === 0) {
      console.error('❌ No users found in database');
      return;
    }
    
    const testUser = users[0];
    console.log('✅ Test user found:', testUser);
    
    // Create a JWT token
    const token = jwt.sign(
      { id: testUser.id, username: testUser.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    console.log('✅ JWT token created:', token.substring(0, 50) + '...');
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT token verified:', decoded);
    
    // Test the profile data query
    const [userData] = await db.query(
      'SELECT id, username, email, sender_email, app_password, profile_photo_filename FROM users WHERE id = ?',
      [testUser.id]
    );
    
    console.log('✅ Profile data query result:', userData[0]);
    
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testAuth(); 