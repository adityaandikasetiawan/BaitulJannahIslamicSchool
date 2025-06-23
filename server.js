const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Load environment variables
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('MongoDB Connection Error:', err.message);
    console.log('Continuing without database connection...');
  });

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
  secret: process.env.SESSION_SECRET,
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

// Import routes
const authRoutes = require('./routes/auth');
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Baitul Jannah Islamic School',
        description: 'Sekolah Para Juara',
        user: req.user
    });
});

// Route untuk halaman kontak
app.get('/kontak', (req, res) => {
    res.render('kontak', {
        title: 'Hubungi Kami - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut',
        user: req.user
    });
}); 

app.get('/sejarahyayasan', (req, res) => {
    res.render('sejarahyayasan', {
        title: 'Sejarah Yayasan - Baitul Jannah Islamic School',
        description: 'Sejarah dan perkembangan Yayasan Baitul Jannah Islamic School',
        user: req.user
    });
});

app.get('/comingsoon', (req, res) => {
    res.render('comingsoon', {
        title: 'Comingsoon - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut',
        user: req.user
    });
});

// Gunakan routes
app.use('/', authRoutes);
app.use('/', pagesRoutes);
app.use('/admin', adminRoutes);

// Handle 404
app.use((req, res) => {
    res.status(404).send('Halaman tidak ditemukan');
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan pada server');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});