const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Dashboard Admin
router.get('/dashboard', ensureAdmin, (req, res) => {
  res.render('admin/dashboard', {
    title: 'Dashboard Admin - Baitul Jannah Islamic School',
    description: 'Panel Admin Baitul Jannah Islamic School',
    user: req.user
  });
});

// Kelola Pengguna
router.get('/users', ensureAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().sort({ createdAt: -1 });
    
    res.render('admin/users', {
      title: 'Kelola Pengguna - Baitul Jannah Islamic School',
      description: 'Kelola Pengguna Baitul Jannah Islamic School',
      user: req.user,
      users
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data pengguna');
    res.redirect('/admin/dashboard');
  }
});

// Kelola Berita
router.get('/berita', ensureAdmin, (req, res) => {
  res.render('admin/berita', {
    title: 'Kelola Berita - Baitul Jannah Islamic School',
    description: 'Kelola Berita Baitul Jannah Islamic School',
    user: req.user
  });
});

// Kelola Pengumuman
router.get('/pengumuman', ensureAdmin, (req, res) => {
  res.render('admin/pengumuman', {
    title: 'Kelola Pengumuman - Baitul Jannah Islamic School',
    description: 'Kelola Pengumuman Baitul Jannah Islamic School',
    user: req.user
  });
});

// Kelola Agenda
router.get('/agenda', ensureAdmin, (req, res) => {
  res.render('admin/agenda', {
    title: 'Kelola Agenda - Baitul Jannah Islamic School',
    description: 'Kelola Agenda Baitul Jannah Islamic School',
    user: req.user
  });
});

// Kelola Galeri
router.get('/galeri', ensureAdmin, (req, res) => {
  res.render('admin/galeri', {
    title: 'Kelola Galeri - Baitul Jannah Islamic School',
    description: 'Kelola Galeri Baitul Jannah Islamic School',
    user: req.user
  });
});

module.exports = router;