const express = require('express');
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../middleware/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('auth/login', {
    title: 'Login - Baitul Jannah Islamic School',
    description: 'Login ke dashboard Baitul Jannah Islamic School'
  });
});

// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'Anda telah berhasil logout');
    res.redirect('/login');
  });
});

// Dashboard - Protected Route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Baitul Jannah Islamic School',
    description: 'Dashboard Admin Baitul Jannah Islamic School',
    user: req.user
  });
});

module.exports = router;