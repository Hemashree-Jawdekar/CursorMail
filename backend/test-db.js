const db = require('./db');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [result] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', result[0]);
    
    // Test users table
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users table accessible. Total users:', users[0].count);
    
    // Test sample user data
    const [sampleUsers] = await db.query('SELECT id, username, email FROM users LIMIT 3');
    console.log('✅ Sample users:', sampleUsers);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testDatabaseConnection(); 