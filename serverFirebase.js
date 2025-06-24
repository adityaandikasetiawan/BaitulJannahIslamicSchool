const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { admin, db } = require('./config/firebase');

// Load environment variables
dotenv.config();

// Passport config (Firebase version)
require('./config/passportFirebase')(passport);

const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware untuk parsing body requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: 'baituljannahsecretkey',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
const authRoutes = require('./routes/authFirebase');
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');

// Gunakan routes
app.use('/', authRoutes);
app.use('/', pagesRoutes);
app.use('/admin', adminRoutes);

// Halaman utama
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Baitul Jannah Islamic School',
    user: req.user
  });
});

// Halaman kontak
app.get('/kontak', (req, res) => {
  res.render('kontak', {
    title: 'Kontak Kami | Baitul Jannah Islamic School',
    user: req.user
  });
});

// Halaman sejarah yayasan
app.get('/sejarahyayasan', (req, res) => {
  res.render('sejarahyayasan', {
    title: 'Sejarah Yayasan | Baitul Jannah Islamic School',
    user: req.user
  });
});

// Halaman coming soon
app.get('/comingsoon', (req, res) => {
  res.render('comingsoon', {
    title: 'Coming Soon | Baitul Jannah Islamic School',
    user: req.user
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: '404 Not Found | Baitul Jannah Islamic School',
    user: req.user
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: '500 Server Error | Baitul Jannah Islamic School',
    user: req.user,
    error: err
  });
});

// Set port
const PORT = process.env.PORT || 3002;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Firebase as database`);
});