const db = require('./db');

async function testDatabaseStructure() {
  try {
    console.log('Testing database structure...');
    
    // Test basic connection
    const [result] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', result[0]);
    
    // Check if users table exists and get its structure
    const [columns] = await db.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'cursor_mail' 
      AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('✅ Users table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if required columns exist
    const requiredColumns = ['id', 'username', 'password', 'email', 'sender_email', 'app_password', 'profile_photo_path', 'profile_photo_filename'];
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    console.log('\n🔍 Checking required columns:');
    requiredColumns.forEach(col => {
      if (existingColumns.includes(col)) {
        console.log(`  ✅ ${col} - exists`);
      } else {
        console.log(`  ❌ ${col} - MISSING`);
      }
    });
    
    // Test sample user data
    const [users] = await db.query('SELECT id, username, email FROM users LIMIT 3');
    console.log('\n✅ Sample users:', users);
    
  } catch (error) {
    console.error('❌ Database structure test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testDatabaseStructure(); 