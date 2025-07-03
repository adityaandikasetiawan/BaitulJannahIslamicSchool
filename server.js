const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const passport = require('passport');
const db = require('./config/database');

// Load environment variables
dotenv.config();

// Test database connection
db.query('SELECT 1')
  .then(() => {
    console.log('MySQL Database Connected');
  })
  .catch(err => {
    console.log('Database Error:', err);
    console.log('Continuing without database connection...');
  });

const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware - Custom configuration
app.use(
  helmet({
    // Disable X-XSS-Protection as it's deprecated
    xssFilter: false,
    // Use Content-Security-Policy instead of X-Frame-Options
    frameguard: false,
    // Configure Content-Security-Policy properly
    contentSecurityPolicy: false
  })
);

// Custom Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://cdnjs.cloudflare.com; frame-ancestors 'self'");
  next();
});

// Cache Control Middleware
app.use((req, res, next) => {
  // Static assets cache (CSS, JS, images, fonts)
  if (req.url.match(/.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    // Add version query parameter for cache busting
    if (req.url.match(/.(css|js)$/) && !req.url.includes('?v=')) {
      req.url = req.url + '?v=1.0.0';
    }
  } 
  // HTML, XML, and JSON files
  else if (req.url.match(/.(html|htm|xml|json|txt)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
  }
  // For other resources
  else {
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
  }
  next();
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk parsing body requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Connect flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport);

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Import routes
const pagesRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Routes
app.use('/', pagesRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Baitul Jannah Islamic School',
    description: 'Selamat datang di Baitul Jannah Islamic School'
  });
});

// Route untuk halaman kontak
app.get('/kontak', (req, res) => {
  res.render('informasi/kontak', {
    title: 'Hubungi Kami - Baitul Jannah Islamic School',
    description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
  });
});

app.get('/sejarahyayasan', (req, res) => {
  res.render('tentangkami/sejarahyayasan', {
    title: 'Sejarah Yayasan - Baitul Jannah Islamic School',
    description: 'Sejarah dan perkembangan Yayasan Baitul Jannah Islamic School'
  });
});

app.get('/comingsoon', (req, res) => {
  res.render('informasi/comingsoon', {
    title: 'Comingsoon - Baitul Jannah Islamic School',
    description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server berjalan di port ' + PORT);
});