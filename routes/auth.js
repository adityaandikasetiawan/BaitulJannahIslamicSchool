const express = require('express');
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

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

// Settings Page - Protected Route
router.get('/settings', ensureAuthenticated, (req, res) => {
  res.render('settings', {
    title: 'Settings - Baitul Jannah Islamic School',
    description: 'Pengaturan Akun Baitul Jannah Islamic School',
    user: req.user
  });
});

// Update Profile Settings
router.post('/settings/update', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, deleteAvatar } = req.body;
    const userId = req.user.id;
    
    // Prepare user data for update
    const userData = {
      firstName,
      lastName,
      phone,
      bio
    };
    
    // If avatar was uploaded, add it to userData
    if (req.file) {
      userData.avatar = `/uploads/avatars/${req.file.filename}`;
      
      // If user had a previous avatar (not the default), delete it
      if (req.user.avatar && req.user.avatar.startsWith('/uploads/avatars/')) {
        const oldAvatarPath = path.join(__dirname, '..', 'public', req.user.avatar);
        try {
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
            console.log(`Deleted old avatar: ${oldAvatarPath}`);
          }
        } catch (err) {
          console.error(`Error deleting old avatar: ${err.message}`);
        }
      }
    } else if (deleteAvatar === 'true') {
      // If user wants to delete their avatar
      userData.avatar = null;
      
      // Delete the avatar file if it exists
      if (req.user.avatar && req.user.avatar.startsWith('/uploads/avatars/')) {
        const avatarPath = path.join(__dirname, '..', 'public', req.user.avatar);
        try {
          if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
            console.log(`Deleted avatar: ${avatarPath}`);
          }
        } catch (err) {
          console.error(`Error deleting avatar: ${err.message}`);
        }
      }
    }
    
    // Update user profile
    const User = require('../models/User');
    const updated = await User.updateProfile(userId, userData);
    
    if (updated) {
      req.flash('success_msg', 'Profil berhasil diperbarui');
    } else {
      req.flash('info_msg', 'Tidak ada perubahan yang dilakukan');
    }
    
    res.redirect('/settings');
  } catch (error) {
    console.error('Error updating profile:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui profil');
    res.redirect('/settings');
  }
});

// Security Settings Page - Protected Route
router.get('/settings/security', ensureAuthenticated, (req, res) => {
  res.render('security', {
    title: 'Security Settings - Baitul Jannah Islamic School',
    description: 'Pengaturan Keamanan Akun Baitul Jannah Islamic School',
    user: req.user
  });
});

// Change Password Process
router.post('/settings/change-password', ensureAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;
    
    // Validate password
    if (newPassword !== confirmPassword) {
      req.flash('error_msg', 'Password baru dan konfirmasi password tidak cocok');
      return res.redirect('/settings/security');
    }
    
    if (newPassword.length < 6) {
      req.flash('error_msg', 'Password baru harus minimal 6 karakter');
      return res.redirect('/settings/security');
    }
    
    // Verify current password
    const isValidPassword = await User.validatePassword(currentPassword, req.user.password);
    if (!isValidPassword) {
      req.flash('error_msg', 'Password saat ini tidak valid');
      return res.redirect('/settings/security');
    }
    
    // Update user password
    await User.updatePassword(userId, newPassword);
    
    req.flash('success_msg', 'Password berhasil diubah');
    res.redirect('/settings/security');
  } catch (error) {
    console.error('Error in change password process:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat mengubah password');
    res.redirect('/settings/security');
  }
});

module.exports = router;