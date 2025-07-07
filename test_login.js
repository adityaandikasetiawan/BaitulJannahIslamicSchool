const axios = require('axios');
const qs = require('querystring');

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // First, get the login page to establish a session
    const loginPageResponse = await axios.get('http://localhost:3002/login');
    console.log('Login page accessible:', loginPageResponse.status === 200);
    
    // Extract cookies from the response
    const cookies = loginPageResponse.headers['set-cookie'];
    let sessionCookie = '';
    if (cookies) {
      sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid'));
    }
    
    // Prepare login data
    const loginData = qs.stringify({
      username: 'admin',
      password: 'admin123'
    });
    
    // Attempt login
    const loginResponse = await axios.post('http://localhost:3002/login', loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionCookie || ''
      },
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', loginResponse.headers.location);
    
    if (loginResponse.status === 302 && loginResponse.headers.location === '/dashboard') {
      console.log('✅ Login successful! Redirected to /dashboard');
      
      // Test dashboard access
      const dashboardResponse = await axios.get('http://localhost:3002/dashboard', {
        headers: {
          'Cookie': loginResponse.headers['set-cookie'] ? loginResponse.headers['set-cookie'].join('; ') : sessionCookie || ''
        },
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      console.log('Dashboard access status:', dashboardResponse.status);
      if (dashboardResponse.status === 200) {
        console.log('✅ Dashboard accessible after login');
      } else {
        console.log('❌ Dashboard not accessible after login');
      }
    } else {
      console.log('❌ Login failed or unexpected redirect');
    }
    
  } catch (error) {
    console.error('Error testing login:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLogin();