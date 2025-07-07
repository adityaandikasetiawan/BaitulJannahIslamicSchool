const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function checkAndCreateUsers() {
  try {
    console.log('Checking users in database...');
    
    // Check if users table exists and has data
    const [users] = await db.query('SELECT * FROM users');
    console.log('Found', users.length, 'users in database');
    
    if (users.length > 0) {
      console.log('Existing users:');
      users.forEach(user => {
        console.log(`- Username: ${user.username}, Role: ${user.role}, Name: ${user.name}`);
      });
    } else {
      console.log('No users found. Creating default admin user...');
      
      // Create default admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const [result] = await db.query(
        'INSERT INTO users (username, password, name, role, email) VALUES (?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin', 'admin@baituljannahschool.com']
      );
      
      if (result.insertId) {
        console.log('Default admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
      } else {
        console.log('Failed to create admin user');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAndCreateUsers();