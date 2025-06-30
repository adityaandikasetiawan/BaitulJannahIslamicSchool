const http = require('http');
const db = require('./config/database');

async function checkServer() {
  try {
    console.log('Checking server status...');
    
    // Check if server is running
    const serverCheck = new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3003/login', (res) => {
        console.log('Server status:', res.statusCode);
        console.log('Server headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log('Response length:', data.length);
          console.log('Response preview:', data.substring(0, 200) + '...');
          resolve(true);
        });
      });
      
      req.on('error', (err) => {
        console.error('Server check error:', err.message);
        reject(err);
      });
      
      req.end();
    });
    
    // Check database connection
    const dbCheck = db.query('SELECT 1 as test')
      .then(result => {
        console.log('\nDatabase connection successful');
        console.log('Database test result:', result);
        return true;
      })
      .catch(err => {
        console.error('\nDatabase connection error:', err.message);
        console.error('Error code:', err.code);
        console.error('Error number:', err.errno);
        console.error('SQL state:', err.sqlState);
        return false;
      });
    
    // Wait for both checks
    const [serverRunning, dbConnected] = await Promise.all([serverCheck, dbCheck]);
    
    console.log('\nSummary:');
    console.log('- Server running:', serverRunning ? 'Yes' : 'No');
    console.log('- Database connected:', dbConnected ? 'Yes' : 'No');
    
    // Check admin user
    if (dbConnected) {
      const users = await db.query('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
      
      if (users && users.length > 0) {
        const user = users[0];
        console.log('\nAdmin user found:');
        console.log('ID:', user.id);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Password hash:', user.password);
      } else {
        console.log('\nAdmin user not found');
      }
    }
    
    console.log('\nCheck completed');
  } catch (error) {
    console.error('Error during check:', error);
  } finally {
    process.exit(0);
  }
}

checkServer();