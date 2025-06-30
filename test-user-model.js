require('dotenv').config();
const User = require('./models/User');

async function testUserModel() {
  try {
    console.log('Testing User model...');
    
    // Test findByUsername
    console.log('\nTesting findByUsername with admin user:');
    const user = await User.findByUsername('admin');
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      });
    }
    
    // Test password validation
    if (user) {
      console.log('\nTesting password validation:');
      const validPassword = await User.validatePassword('admin123', user.password);
      console.log('Password valid:', validPassword ? 'Yes' : 'No');
    }
    
    console.log('\nUser model test completed.');
  } catch (error) {
    console.error('Error testing User model:', error);
  } finally {
    process.exit(0);
  }
}

testUserModel();