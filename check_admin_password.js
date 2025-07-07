const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function checkAndResetAdminPassword() {
  try {
    console.log('Checking admin user password...');
    
    // Get admin user
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (users.length === 0) {
      console.log('Admin user not found');
      return;
    }
    
    const admin = users[0];
    console.log('Admin user found:', admin.username);
    
    // Test current password
    const testPasswords = ['admin123', 'admin', 'password', '123456'];
    
    for (const testPassword of testPasswords) {
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      if (isMatch) {
        console.log(`✅ Current password is: ${testPassword}`);
        return;
      }
    }
    
    console.log('❌ None of the common passwords match. Resetting password to "admin123"...');
    
    // Reset password to admin123
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Password reset successfully!');
      console.log('New credentials:');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('❌ Failed to reset password');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAndResetAdminPassword();