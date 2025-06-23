const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { forwardAuthenticated } = require('../middleware/auth');

// Halaman Login
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', {
    title: 'Login - Baitul Jannah Islamic School',
    description: 'Login ke akun Anda'
  });
});

// Proses Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Halaman Register
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register', {
    title: 'Register - Baitul Jannah Islamic School',
    description: 'Daftar akun baru'
  });
});

// Proses Register
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Validasi input
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Silakan isi semua field' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Password tidak cocok' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password harus minimal 6 karakter' });
  }

  if (errors.length > 0) {
    res.render('register', {
      title: 'Register - Baitul Jannah Islamic School',
      description: 'Daftar akun baru',
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ email: email });
      
      if (existingUser) {
        errors.push({ msg: 'Email sudah terdaftar' });
        res.render('register', {
          title: 'Register - Baitul Jannah Islamic School',
          description: 'Daftar akun baru',
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // Buat user baru
        const newUser = new User({
          name,
          email,
          password
        });

        // Simpan user ke database
        await newUser.save();
        req.flash('success_msg', 'Anda berhasil mendaftar dan sekarang dapat login');
        res.redirect('/login');
      }
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Terjadi kesalahan saat mendaftar');
      res.redirect('/register');
    }
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'Anda telah logout');
    res.redirect('/login');
  });
});

module.exports = router;