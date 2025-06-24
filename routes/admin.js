const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Berita = require('../models/Berita');
const Pengumuman = require('../models/Pengumuman');
const Agenda = require('../models/Agenda');
const Galeri = require('../models/Galeri');

// Dashboard Admin
router.get('/dashboard', ensureAdmin, async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const beritaCount = await Berita.countDocuments();
    const pengumumanCount = await Pengumuman.countDocuments();
    const agendaCount = await Agenda.countDocuments();
    const galeriCount = await Galeri.countDocuments();
    
    // Get recent data
    const recentBerita = await Berita.find().sort({ createdAt: -1 }).limit(5);
    const upcomingAgenda = await Agenda.find({ 
        status: { $in: ['upcoming', 'ongoing'] },
        tanggal: { $gte: new Date() }
    }).sort({ tanggal: 1 }).limit(5);
    
    const today = new Date();
    const activePengumuman = await Pengumuman.find({
        tanggalMulai: { $lte: today },
        tanggalSelesai: { $gte: today },
        status: 'published'
    }).sort({ penting: -1 }).limit(5);
    
    const recentUsers = await User.find().sort({ date: -1 }).limit(5);
    
    res.render('admin/dashboard', {
        title: 'Dashboard Admin - Baitul Jannah Islamic School',
        description: 'Panel Admin Baitul Jannah Islamic School',
        user: req.user,
        counts: {
            users: userCount,
            berita: beritaCount,
            pengumuman: pengumumanCount,
            agenda: agendaCount,
            galeri: galeriCount
        },
        recentBerita,
        upcomingAgenda,
        activePengumuman,
        recentUsers
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat dashboard');
    res.redirect('/admin/dashboard');
  }
});

// ===== USER MANAGEMENT ROUTES =====

// Get all users
router.get('/users', ensureAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 });
    res.render('admin/users', {
      title: 'Kelola Pengguna - Baitul Jannah Islamic School',
      description: 'Kelola Pengguna Baitul Jannah Islamic School',
      user: req.user,
      users,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data pengguna');
    res.redirect('/admin/dashboard');
  }
});

// Show add user form
router.get('/users/tambah', ensureAdmin, (req, res) => {
  res.render('admin/users-tambah', {
    title: 'Tambah Pengguna - Baitul Jannah Islamic School',
    description: 'Tambah Pengguna Baru Baitul Jannah Islamic School',
    user: req.user,
    error_msg: req.flash('error_msg')
  });
});

// Process add user
router.post('/users/tambah', ensureAdmin, async (req, res) => {
  const { name, email, password, password2, role, phone, address } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2 || !role) {
    errors.push({ msg: 'Harap isi semua field yang wajib' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Password tidak cocok' });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password harus minimal 6 karakter' });
  }

  if (errors.length > 0) {
    res.render('admin/users-tambah', {
      title: 'Tambah Pengguna - Baitul Jannah Islamic School',
      description: 'Tambah Pengguna Baru Baitul Jannah Islamic School',
      errors,
      name,
      email,
      role,
      phone,
      address,
      user: req.user
    });
  } else {
    try {
      // Check if email exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        errors.push({ msg: 'Email sudah terdaftar' });
        res.render('admin/users-tambah', {
          title: 'Tambah Pengguna - Baitul Jannah Islamic School',
          description: 'Tambah Pengguna Baru Baitul Jannah Islamic School',
          errors,
          name,
          email,
          role,
          phone,
          address,
          user: req.user
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role,
          phone,
          address,
          isActive: true
        });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        req.flash('success_msg', 'Pengguna baru berhasil ditambahkan');
        res.redirect('/admin/users');
      }
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Terjadi kesalahan saat menambahkan pengguna');
      res.redirect('/admin/users/tambah');
    }
  }
});

// Show edit user form
router.get('/users/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error_msg', 'Pengguna tidak ditemukan');
      return res.redirect('/admin/users');
    }

    res.render('admin/users-edit', {
      title: 'Edit Pengguna - Baitul Jannah Islamic School',
      description: 'Edit Pengguna Baitul Jannah Islamic School',
      user: req.user,
      user: user, // The user to edit
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data pengguna');
    res.redirect('/admin/users');
  }
});

// Process edit user
router.post('/users/edit/:id', ensureAdmin, async (req, res) => {
  const { name, email, password, password2, role, phone, address, isActive } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !role) {
    errors.push({ msg: 'Harap isi semua field yang wajib' });
  }

  // Check passwords match if provided
  if (password && password !== password2) {
    errors.push({ msg: 'Password tidak cocok' });
  }

  // Check password length if provided
  if (password && password.length < 6) {
    errors.push({ msg: 'Password harus minimal 6 karakter' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error_msg', 'Pengguna tidak ditemukan');
      return res.redirect('/admin/users');
    }

    if (errors.length > 0) {
      return res.render('admin/users-edit', {
        title: 'Edit Pengguna - Baitul Jannah Islamic School',
        description: 'Edit Pengguna Baitul Jannah Islamic School',
        errors,
        user: req.user,
        user: user
      });
    }

    // Check if email exists and it's not the current user's email
    if (email !== user.email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        errors.push({ msg: 'Email sudah digunakan oleh pengguna lain' });
        return res.render('admin/users-edit', {
          title: 'Edit Pengguna - Baitul Jannah Islamic School',
          description: 'Edit Pengguna Baitul Jannah Islamic School',
          errors,
          user: req.user,
          user: user
        });
      }
    }

    // Update user
    user.name = name;
    user.email = email;
    user.role = role;
    user.phone = phone;
    user.address = address;
    user.isActive = isActive === 'on' ? true : false;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    req.flash('success_msg', 'Data pengguna berhasil diperbarui');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data pengguna');
    res.redirect(`/admin/users/edit/${req.params.id}`);
  }
});

// Delete user
router.post('/users/delete', ensureAdmin, async (req, res) => {
  try {
    const { user_id } = req.body;
    
    // Prevent deleting self
    if (user_id === req.user.id) {
      req.flash('error_msg', 'Anda tidak dapat menghapus akun Anda sendiri');
      return res.redirect('/admin/users');
    }
    
    await User.findByIdAndDelete(user_id);
    req.flash('success_msg', 'Pengguna berhasil dihapus');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus pengguna');
    res.redirect('/admin/users');
  }
});

// Kelola Berita

// Tampilkan semua berita
router.get('/berita', ensureAdmin, async (req, res) => {
  try {
    const berita = await Berita.find().populate('penulis', 'name').sort({ createdAt: -1 });
    
    res.render('admin/berita', {
      title: 'Kelola Berita - Baitul Jannah Islamic School',
      description: 'Kelola Berita Baitul Jannah Islamic School',
      user: req.user,
      berita
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data berita');
    res.redirect('/admin/dashboard');
  }
});

// Tampilkan form tambah berita
router.get('/berita/tambah', ensureAdmin, (req, res) => {
  res.render('admin/berita-form', {
    title: 'Tambah Berita - Baitul Jannah Islamic School',
    description: 'Tambah Berita Baru',
    user: req.user,
    berita: null,
    action: '/admin/berita/tambah'
  });
});

// Proses tambah berita
router.post('/berita/tambah', ensureAdmin, async (req, res) => {
  try {
    const { judul, isi, kategori, status } = req.body;
    let gambar = 'default-berita.jpg'; // Default gambar
    
    // TODO: Proses upload gambar
    
    const newBerita = new Berita({
      judul,
      isi,
      gambar,
      kategori,
      status,
      penulis: req.user.id
    });
    
    await newBerita.save();
    req.flash('success_msg', 'Berita berhasil ditambahkan');
    res.redirect('/admin/berita');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan berita');
    res.redirect('/admin/berita/tambah');
  }
});

// Tampilkan form edit berita
router.get('/berita/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const berita = await Berita.findById(req.params.id);
    
    if (!berita) {
      req.flash('error_msg', 'Berita tidak ditemukan');
      return res.redirect('/admin/berita');
    }
    
    res.render('admin/berita-form', {
      title: 'Edit Berita - Baitul Jannah Islamic School',
      description: 'Edit Berita',
      user: req.user,
      berita,
      action: `/admin/berita/edit/${berita._id}`
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data berita');
    res.redirect('/admin/berita');
  }
});

// Proses edit berita
router.post('/berita/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const { judul, isi, kategori, status } = req.body;
    
    // TODO: Proses upload gambar jika ada
    
    await Berita.findByIdAndUpdate(req.params.id, {
      judul,
      isi,
      kategori,
      status,
      updatedAt: Date.now()
    });
    
    req.flash('success_msg', 'Berita berhasil diperbarui');
    res.redirect('/admin/berita');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui berita');
    res.redirect(`/admin/berita/edit/${req.params.id}`);
  }
});

// Hapus berita
router.get('/berita/hapus/:id', ensureAdmin, async (req, res) => {
  try {
    await Berita.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Berita berhasil dihapus');
    res.redirect('/admin/berita');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus berita');
    res.redirect('/admin/berita');
  }
});

// Kelola Pengumuman

// Tampilkan semua pengumuman
router.get('/pengumuman', ensureAdmin, async (req, res) => {
  try {
    const pengumuman = await Pengumuman.find().populate('penulis', 'name').sort({ createdAt: -1 });
    
    res.render('admin/pengumuman', {
      title: 'Kelola Pengumuman - Baitul Jannah Islamic School',
      description: 'Kelola Pengumuman Baitul Jannah Islamic School',
      user: req.user,
      pengumuman
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data pengumuman');
    res.redirect('/admin/dashboard');
  }
});

// Tampilkan form tambah pengumuman
router.get('/pengumuman/tambah', ensureAdmin, (req, res) => {
  res.render('admin/pengumuman-form', {
    title: 'Tambah Pengumuman - Baitul Jannah Islamic School',
    description: 'Tambah Pengumuman Baru',
    user: req.user,
    pengumuman: null,
    action: '/admin/pengumuman/tambah'
  });
});

// Proses tambah pengumuman
router.post('/pengumuman/tambah', ensureAdmin, async (req, res) => {
  try {
    const { judul, isi, tanggalMulai, tanggalSelesai, penting, untuk, status } = req.body;
    let lampiran = null; // Default tidak ada lampiran
    
    // TODO: Proses upload lampiran jika ada
    
    const newPengumuman = new Pengumuman({
      judul,
      isi,
      tanggalMulai,
      tanggalSelesai,
      penting: penting === 'on',
      untuk,
      lampiran,
      status,
      penulis: req.user.id
    });
    
    await newPengumuman.save();
    req.flash('success_msg', 'Pengumuman berhasil ditambahkan');
    res.redirect('/admin/pengumuman');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan pengumuman');
    res.redirect('/admin/pengumuman/tambah');
  }
});

// Tampilkan form edit pengumuman
router.get('/pengumuman/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const pengumuman = await Pengumuman.findById(req.params.id);
    
    if (!pengumuman) {
      req.flash('error_msg', 'Pengumuman tidak ditemukan');
      return res.redirect('/admin/pengumuman');
    }
    
    res.render('admin/pengumuman-form', {
      title: 'Edit Pengumuman - Baitul Jannah Islamic School',
      description: 'Edit Pengumuman',
      user: req.user,
      pengumuman,
      action: `/admin/pengumuman/edit/${pengumuman._id}`
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data pengumuman');
    res.redirect('/admin/pengumuman');
  }
});

// Proses edit pengumuman
router.post('/pengumuman/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const { judul, isi, tanggalMulai, tanggalSelesai, penting, untuk, status } = req.body;
    
    // TODO: Proses upload lampiran jika ada
    
    await Pengumuman.findByIdAndUpdate(req.params.id, {
      judul,
      isi,
      tanggalMulai,
      tanggalSelesai,
      penting: penting === 'on',
      untuk,
      status,
      updatedAt: Date.now()
    });
    
    req.flash('success_msg', 'Pengumuman berhasil diperbarui');
    res.redirect('/admin/pengumuman');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui pengumuman');
    res.redirect(`/admin/pengumuman/edit/${req.params.id}`);
  }
});

// Hapus pengumuman
router.get('/pengumuman/hapus/:id', ensureAdmin, async (req, res) => {
  try {
    await Pengumuman.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Pengumuman berhasil dihapus');
    res.redirect('/admin/pengumuman');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus pengumuman');
    res.redirect('/admin/pengumuman');
  }
});

// Kelola Agenda

// Tampilkan semua agenda
router.get('/agenda', ensureAdmin, async (req, res) => {
  try {
    const agenda = await Agenda.find().populate('createdBy', 'name').sort({ tanggal: 1 });
    
    res.render('admin/agenda', {
      title: 'Kelola Agenda - Baitul Jannah Islamic School',
      description: 'Kelola Agenda Baitul Jannah Islamic School',
      user: req.user,
      agenda
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data agenda');
    res.redirect('/admin/dashboard');
  }
});

// Tampilkan form tambah agenda
router.get('/agenda/tambah', ensureAdmin, (req, res) => {
  res.render('admin/agenda-form', {
    title: 'Tambah Agenda - Baitul Jannah Islamic School',
    description: 'Tambah Agenda Baru',
    user: req.user,
    agenda: null,
    action: '/admin/agenda/tambah'
  });
});

// Proses tambah agenda
router.post('/agenda/tambah', ensureAdmin, async (req, res) => {
  try {
    const { judul, deskripsi, tanggal, waktuMulai, waktuSelesai, lokasi, penyelenggara, kategori, status } = req.body;
    let gambar = null; // Default tidak ada gambar
    
    // TODO: Proses upload gambar jika ada
    
    const newAgenda = new Agenda({
      judul,
      deskripsi,
      tanggal,
      waktuMulai,
      waktuSelesai,
      lokasi,
      penyelenggara,
      gambar,
      kategori,
      status,
      createdBy: req.user.id
    });
    
    await newAgenda.save();
    req.flash('success_msg', 'Agenda berhasil ditambahkan');
    res.redirect('/admin/agenda');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan agenda');
    res.redirect('/admin/agenda/tambah');
  }
});

// Tampilkan form edit agenda
router.get('/agenda/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    
    if (!agenda) {
      req.flash('error_msg', 'Agenda tidak ditemukan');
      return res.redirect('/admin/agenda');
    }
    
    res.render('admin/agenda-form', {
      title: 'Edit Agenda - Baitul Jannah Islamic School',
      description: 'Edit Agenda',
      user: req.user,
      agenda,
      action: `/admin/agenda/edit/${agenda._id}`
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data agenda');
    res.redirect('/admin/agenda');
  }
});

// Proses edit agenda
router.post('/agenda/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const { judul, deskripsi, tanggal, waktuMulai, waktuSelesai, lokasi, penyelenggara, kategori, status } = req.body;
    
    // TODO: Proses upload gambar jika ada
    
    await Agenda.findByIdAndUpdate(req.params.id, {
      judul,
      deskripsi,
      tanggal,
      waktuMulai,
      waktuSelesai,
      lokasi,
      penyelenggara,
      kategori,
      status,
      updatedAt: Date.now()
    });
    
    req.flash('success_msg', 'Agenda berhasil diperbarui');
    res.redirect('/admin/agenda');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui agenda');
    res.redirect(`/admin/agenda/edit/${req.params.id}`);
  }
});

// Hapus agenda
router.get('/agenda/hapus/:id', ensureAdmin, async (req, res) => {
  try {
    await Agenda.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Agenda berhasil dihapus');
    res.redirect('/admin/agenda');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus agenda');
    res.redirect('/admin/agenda');
  }
});

// Kelola Galeri

// Tampilkan semua galeri
router.get('/galeri', ensureAdmin, async (req, res) => {
  try {
    const galeri = await Galeri.find().populate('uploadedBy', 'name').sort({ createdAt: -1 });
    
    res.render('admin/galeri', {
      title: 'Kelola Galeri - Baitul Jannah Islamic School',
      description: 'Kelola Galeri Baitul Jannah Islamic School',
      user: req.user,
      galeri
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data galeri');
    res.redirect('/admin/dashboard');
  }
});

// Tampilkan form tambah galeri
router.get('/galeri/tambah', ensureAdmin, (req, res) => {
  res.render('admin/galeri-form', {
    title: 'Tambah Galeri - Baitul Jannah Islamic School',
    description: 'Tambah Galeri Baru',
    user: req.user,
    galeri: null,
    action: '/admin/galeri/tambah'
  });
});

// Proses tambah galeri
router.post('/galeri/tambah', ensureAdmin, async (req, res) => {
  try {
    const { judul, deskripsi, kategori, tanggal, isPublished } = req.body;
    let gambar = 'default-galeri.jpg'; // Default gambar
    
    // TODO: Proses upload gambar
    
    const newGaleri = new Galeri({
      judul,
      deskripsi,
      gambar,
      kategori,
      tanggal: tanggal || Date.now(),
      isPublished: isPublished === 'on',
      uploadedBy: req.user.id
    });
    
    await newGaleri.save();
    req.flash('success_msg', 'Galeri berhasil ditambahkan');
    res.redirect('/admin/galeri');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan galeri');
    res.redirect('/admin/galeri/tambah');
  }
});

// Tampilkan form edit galeri
router.get('/galeri/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const galeri = await Galeri.findById(req.params.id);
    
    if (!galeri) {
      req.flash('error_msg', 'Galeri tidak ditemukan');
      return res.redirect('/admin/galeri');
    }
    
    res.render('admin/galeri-form', {
      title: 'Edit Galeri - Baitul Jannah Islamic School',
      description: 'Edit Galeri',
      user: req.user,
      galeri,
      action: `/admin/galeri/edit/${galeri._id}`
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat mengambil data galeri');
    res.redirect('/admin/galeri');
  }
});

// Proses edit galeri
router.post('/galeri/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const { judul, deskripsi, kategori, tanggal, isPublished } = req.body;
    
    // TODO: Proses upload gambar jika ada
    
    await Galeri.findByIdAndUpdate(req.params.id, {
      judul,
      deskripsi,
      kategori,
      tanggal,
      isPublished: isPublished === 'on',
      updatedAt: Date.now()
    });
    
    req.flash('success_msg', 'Galeri berhasil diperbarui');
    res.redirect('/admin/galeri');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui galeri');
    res.redirect(`/admin/galeri/edit/${req.params.id}`);
  }
});

// Hapus galeri
router.get('/galeri/hapus/:id', ensureAdmin, async (req, res) => {
  try {
    await Galeri.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Galeri berhasil dihapus');
    res.redirect('/admin/galeri');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus galeri');
    res.redirect('/admin/galeri');
  }
});

module.exports = router;