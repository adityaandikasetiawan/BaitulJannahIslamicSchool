require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function fixAdminPassword() {
  try {
    console.log('Fixing admin password...');
    
    // Generate new hashed password for admin123
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    console.log('New hashed password generated');
    
    // Update admin user password
    await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
    
    console.log('Admin password updated successfully');
    
    // Verify the update
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (rows.length > 0) {
      console.log('Admin user found with updated password');
      
      // Test the password
      const isMatch = await bcrypt.compare('admin123', rows[0].password);
      console.log('Password validation test:', isMatch ? 'Success' : 'Failed');
    }
  } catch (error) {
    console.error('Error fixing admin password:', error);
  } finally {
    process.exit(0);
  }
}

fixAdminPassword();