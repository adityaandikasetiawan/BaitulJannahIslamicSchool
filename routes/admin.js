const express = require('express');
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

// Models
const Akademik = require('../models/Akademik');
const Informasi = require('../models/Informasi');
const Kegiatan = require('../models/Kegiatan');
const TentangKami = require('../models/TentangKami');
const Agenda = require('../models/Agenda');
const Pengumuman = require('../models/Pengumuman');
const Berita = require('../models/Berita');
const Galeri = require('../models/Galeri');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

// Admin Dashboard
router.get('/dashboard', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    // Get counts for dashboard
    const [siswaCount] = await db.query('SELECT COUNT(*) as count FROM siswa');
    const [guruCount] = await db.query('SELECT COUNT(*) as count FROM guru');
    const [matpelCount] = await db.query('SELECT COUNT(*) as count FROM mata_pelajaran');
    const [kelasCount] = await db.query('SELECT COUNT(*) as count FROM kelas WHERE status = "aktif"');
    
    // Get latest agenda
    const [agendas] = await db.query('SELECT * FROM agenda ORDER BY created_at DESC LIMIT 5');
    
    // Get latest pengumuman
    const [pengumumans] = await db.query('SELECT * FROM pengumuman ORDER BY created_at DESC LIMIT 5');
    
    res.render('dashboard', {
      title: 'Dashboard Admin - Baitul Jannah Islamic School',
      description: 'Dashboard Admin Baitul Jannah Islamic School',
      user: req.user,
      siswaCount: siswaCount[0].count,
      guruCount: guruCount[0].count,
      matpelCount: matpelCount[0].count,
      kelasCount: kelasCount[0].count,
      agendas,
      pengumumans
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat dashboard');
    res.redirect('/');
  }
});

// ===== AKADEMIK ROUTES =====

// List Akademik
router.get('/akademik', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const akademik = await Akademik.findAll();
    res.render('admin/akademik/index', {
      title: 'Kelola Akademik - Baitul Jannah Islamic School',
      description: 'Kelola data akademik Baitul Jannah Islamic School',
      user: req.user,
      akademik
    });
  } catch (error) {
    console.error('Akademik Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data akademik');
    res.redirect('/dashboard');
  }
});

// Create Akademik Form
router.get('/akademik/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/akademik/tambah', {
    title: 'Tambah Akademik - Baitul Jannah Islamic School',
    description: 'Tambah data akademik Baitul Jannah Islamic School',
    user: req.user
  });
});

// Create Akademik Process
router.post('/akademik/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, jenis, status } = req.body;
    const gambar = req.file ? '/uploads/' + req.file.filename : null;
    
    const akademikData = {
      judul,
      deskripsi,
      jenis,
      gambar,
      status,
      created_by: req.user.id
    };
    
    await Akademik.create(akademikData);
    req.flash('success_msg', 'Data akademik berhasil ditambahkan');
    res.redirect('/admin/akademik');
  } catch (error) {
    console.error('Create Akademik Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan data akademik');
    res.redirect('/admin/akademik/tambah');
  }
});

// Edit Akademik Form
router.get('/akademik/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const akademik = await Akademik.findById(req.params.id);
    if (!akademik) {
      req.flash('error_msg', 'Data akademik tidak ditemukan');
      return res.redirect('/admin/akademik');
    }
    
    res.render('admin/akademik/edit', {
      title: 'Edit Akademik - Baitul Jannah Islamic School',
      description: 'Edit data akademik Baitul Jannah Islamic School',
      user: req.user,
      akademik
    });
  } catch (error) {
    console.error('Edit Akademik Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data akademik');
    res.redirect('/admin/akademik');
  }
});

// Update Akademik Process
router.post('/akademik/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, jenis, status } = req.body;
    const akademik = await Akademik.findById(req.params.id);
    
    if (!akademik) {
      req.flash('error_msg', 'Data akademik tidak ditemukan');
      return res.redirect('/admin/akademik');
    }
    
    const gambar = req.file ? '/uploads/' + req.file.filename : akademik.gambar;
    
    const akademikData = {
      judul,
      deskripsi,
      jenis,
      gambar,
      status
    };
    
    await Akademik.update(req.params.id, akademikData);
    req.flash('success_msg', 'Data akademik berhasil diperbarui');
    res.redirect('/admin/akademik');
  } catch (error) {
    console.error('Update Akademik Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data akademik');
    res.redirect(`/admin/akademik/edit/${req.params.id}`);
  }
});

// Delete Akademik
router.post('/akademik/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const akademik = await Akademik.findById(req.params.id);
    
    if (!akademik) {
      req.flash('error_msg', 'Data akademik tidak ditemukan');
      return res.redirect('/admin/akademik');
    }
    
    // Delete image file if exists
    if (akademik.gambar) {
      const imagePath = path.join(__dirname, '../public', akademik.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Akademik.delete(req.params.id);
    req.flash('success_msg', 'Data akademik berhasil dihapus');
    res.redirect('/admin/akademik');
  } catch (error) {
    console.error('Delete Akademik Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data akademik');
    res.redirect('/admin/akademik');
  }
});

// ===== INFORMASI ROUTES =====

// List Informasi
router.get('/informasi', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const informasi = await Informasi.findAll();
    res.render('admin/informasi/index', {
      title: 'Kelola Informasi - Baitul Jannah Islamic School',
      description: 'Kelola data informasi Baitul Jannah Islamic School',
      user: req.user,
      informasi
    });
  } catch (error) {
    console.error('Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data informasi');
    res.redirect('/dashboard');
  }
});

// Create Informasi Form
router.get('/informasi/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/informasi/tambah', {
    title: 'Tambah Informasi - Baitul Jannah Islamic School',
    description: 'Tambah data informasi Baitul Jannah Islamic School',
    user: req.user
  });
});

// Create Informasi Process
router.post('/informasi/tambah', ensureAuthenticated, isAdmin, upload.fields([
  { name: 'gambar', maxCount: 1 },
  { name: 'dokumen', maxCount: 1 }
]), async (req, res) => {
  try {
    const { judul, konten, jenis, status } = req.body;
    const gambar = req.files.gambar ? '/uploads/' + req.files.gambar[0].filename : null;
    const dokumen = req.files.dokumen ? '/uploads/' + req.files.dokumen[0].filename : null;
    
    const informasiData = {
      judul,
      konten,
      jenis,
      gambar,
      dokumen,
      status,
      created_by: req.user.id
    };
    
    await Informasi.create(informasiData);
    req.flash('success_msg', 'Data informasi berhasil ditambahkan');
    res.redirect('/admin/informasi');
  } catch (error) {
    console.error('Create Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan data informasi');
    res.redirect('/admin/informasi/tambah');
  }
});

// Edit Informasi Form
router.get('/informasi/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const informasi = await Informasi.findById(req.params.id);
    if (!informasi) {
      req.flash('error_msg', 'Data informasi tidak ditemukan');
      return res.redirect('/admin/informasi');
    }
    
    res.render('admin/informasi/edit', {
      title: 'Edit Informasi - Baitul Jannah Islamic School',
      description: 'Edit data informasi Baitul Jannah Islamic School',
      user: req.user,
      informasi
    });
  } catch (error) {
    console.error('Edit Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data informasi');
    res.redirect('/admin/informasi');
  }
});

// Update Informasi Process
router.post('/informasi/edit/:id', ensureAuthenticated, isAdmin, upload.fields([
  { name: 'gambar', maxCount: 1 },
  { name: 'dokumen', maxCount: 1 }
]), async (req, res) => {
  try {
    const { judul, konten, jenis, status } = req.body;
    const informasi = await Informasi.findById(req.params.id);
    
    if (!informasi) {
      req.flash('error_msg', 'Data informasi tidak ditemukan');
      return res.redirect('/admin/informasi');
    }
    
    const gambar = req.files.gambar ? '/uploads/' + req.files.gambar[0].filename : informasi.gambar;
    const dokumen = req.files.dokumen ? '/uploads/' + req.files.dokumen[0].filename : informasi.dokumen;
    
    const informasiData = {
      judul,
      konten,
      jenis,
      gambar,
      dokumen,
      status
    };
    
    await Informasi.update(req.params.id, informasiData);
    req.flash('success_msg', 'Data informasi berhasil diperbarui');
    res.redirect('/admin/informasi');
  } catch (error) {
    console.error('Update Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data informasi');
    res.redirect(`/admin/informasi/edit/${req.params.id}`);
  }
});

// Delete Informasi
router.post('/informasi/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const informasi = await Informasi.findById(req.params.id);
    
    if (!informasi) {
      req.flash('error_msg', 'Data informasi tidak ditemukan');
      return res.redirect('/admin/informasi');
    }
    
    // Delete files if exist
    if (informasi.gambar) {
      const imagePath = path.join(__dirname, '../public', informasi.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (informasi.dokumen) {
      const docPath = path.join(__dirname, '../public', informasi.dokumen);
      if (fs.existsSync(docPath)) {
        fs.unlinkSync(docPath);
      }
    }
    
    await Informasi.delete(req.params.id);
    req.flash('success_msg', 'Data informasi berhasil dihapus');
    res.redirect('/admin/informasi');
  } catch (error) {
    console.error('Delete Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data informasi');
    res.redirect('/admin/informasi');
  }
});

// ===== KEGIATAN ROUTES =====

// List Kegiatan
router.get('/kegiatan', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const kegiatan = await Kegiatan.findAll();
    res.render('admin/kegiatan/index', {
      title: 'Kelola Kegiatan - Baitul Jannah Islamic School',
      description: 'Kelola data kegiatan Baitul Jannah Islamic School',
      user: req.user,
      kegiatan
    });
  } catch (error) {
    console.error('Kegiatan Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data kegiatan');
    res.redirect('/dashboard');
  }
});

// Create Kegiatan Form
router.get('/kegiatan/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/kegiatan/tambah', {
    title: 'Tambah Kegiatan - Baitul Jannah Islamic School',
    description: 'Tambah data kegiatan Baitul Jannah Islamic School',
    user: req.user
  });
});

// Create Kegiatan Process
router.post('/kegiatan/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, tanggal, waktu_mulai, waktu_selesai, lokasi, jenis, status } = req.body;
    const gambar = req.file ? '/uploads/' + req.file.filename : null;
    
    const kegiatanData = {
      judul,
      deskripsi,
      tanggal,
      waktuMulai: waktu_mulai,
      waktuSelesai: waktu_selesai,
      lokasi,
      jenis,
      gambar,
      status,
      created_by: req.user.id
    };
    
    await Kegiatan.create(kegiatanData);
    req.flash('success_msg', 'Data kegiatan berhasil ditambahkan');
    res.redirect('/admin/kegiatan');
  } catch (error) {
    console.error('Create Kegiatan Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan data kegiatan');
    res.redirect('/admin/kegiatan/tambah');
  }
});

// Edit Kegiatan Form
router.get('/kegiatan/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const kegiatan = await Kegiatan.findById(req.params.id);
    if (!kegiatan) {
      req.flash('error_msg', 'Data kegiatan tidak ditemukan');
      return res.redirect('/admin/kegiatan');
    }
    
    res.render('admin/kegiatan/edit', {
      title: 'Edit Kegiatan - Baitul Jannah Islamic School',
      description: 'Edit data kegiatan Baitul Jannah Islamic School',
      user: req.user,
      kegiatan
    });
  } catch (error) {
    console.error('Edit Kegiatan Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data kegiatan');
    res.redirect('/admin/kegiatan');
  }
});

// Update Kegiatan Process
router.post('/kegiatan/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, tanggal, waktu_mulai, waktu_selesai, lokasi, jenis, status } = req.body;
    const kegiatan = await Kegiatan.findById(req.params.id);
    
    if (!kegiatan) {
      req.flash('error_msg', 'Data kegiatan tidak ditemukan');
      return res.redirect('/admin/kegiatan');
    }
    
    const gambar = req.file ? '/uploads/' + req.file.filename : kegiatan.gambar;
    
    const kegiatanData = {
      judul,
      deskripsi,
      tanggal,
      waktuMulai: waktu_mulai,
      waktuSelesai: waktu_selesai,
      lokasi,
      jenis,
      gambar,
      status
    };
    
    await Kegiatan.update(req.params.id, kegiatanData);
    req.flash('success_msg', 'Data kegiatan berhasil diperbarui');
    res.redirect('/admin/kegiatan');
  } catch (error) {
    console.error('Update Kegiatan Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data kegiatan');
    res.redirect(`/admin/kegiatan/edit/${req.params.id}`);
  }
});

// Delete Kegiatan
router.post('/kegiatan/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const kegiatan = await Kegiatan.findById(req.params.id);
    
    if (!kegiatan) {
      req.flash('error_msg', 'Data kegiatan tidak ditemukan');
      return res.redirect('/admin/kegiatan');
    }
    
    // Delete image file if exists
    if (kegiatan.gambar) {
      const imagePath = path.join(__dirname, '../public', kegiatan.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Kegiatan.delete(req.params.id);
    req.flash('success_msg', 'Data kegiatan berhasil dihapus');
    res.redirect('/admin/kegiatan');
  } catch (error) {
    console.error('Delete Kegiatan Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data kegiatan');
    res.redirect('/admin/kegiatan');
  }
});

// ===== TENTANG KAMI ROUTES =====

// List Tentang Kami
router.get('/tentangkami', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const tentangKami = await TentangKami.findAll();
    res.render('admin/tentangkami/index', {
      title: 'Kelola Tentang Kami - Baitul Jannah Islamic School',
      description: 'Kelola data tentang kami Baitul Jannah Islamic School',
      user: req.user,
      tentangKami
    });
  } catch (error) {
    console.error('Tentang Kami Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data tentang kami');
    res.redirect('/dashboard');
  }
});

// Create Tentang Kami Form
router.get('/tentangkami/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/tentangkami/tambah', {
    title: 'Tambah Tentang Kami - Baitul Jannah Islamic School',
    description: 'Tambah data tentang kami Baitul Jannah Islamic School',
    user: req.user
  });
});

// Create Tentang Kami Process
router.post('/tentangkami/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, konten, jenis, status } = req.body;
    const gambar = req.file ? '/uploads/' + req.file.filename : null;
    
    const tentangKamiData = {
      judul,
      konten,
      jenis,
      gambar,
      status,
      created_by: req.user.id
    };
    
    await TentangKami.create(tentangKamiData);
    req.flash('success_msg', 'Data tentang kami berhasil ditambahkan');
    res.redirect('/admin/tentangkami');
  } catch (error) {
    console.error('Create Tentang Kami Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan data tentang kami');
    res.redirect('/admin/tentangkami/tambah');
  }
});

// Edit Tentang Kami Form
router.get('/tentangkami/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const tentangKami = await TentangKami.findById(req.params.id);
    if (!tentangKami) {
      req.flash('error_msg', 'Data tentang kami tidak ditemukan');
      return res.redirect('/admin/tentangkami');
    }
    
    res.render('admin/tentangkami/edit', {
      title: 'Edit Tentang Kami - Baitul Jannah Islamic School',
      description: 'Edit data tentang kami Baitul Jannah Islamic School',
      user: req.user,
      tentangKami
    });
  } catch (error) {
    console.error('Edit Tentang Kami Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data tentang kami');
    res.redirect('/admin/tentangkami');
  }
});

// Update Tentang Kami Process
router.post('/tentangkami/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, konten, jenis, status } = req.body;
    const tentangKami = await TentangKami.findById(req.params.id);
    
    if (!tentangKami) {
      req.flash('error_msg', 'Data tentang kami tidak ditemukan');
      return res.redirect('/admin/tentangkami');
    }
    
    const gambar = req.file ? '/uploads/' + req.file.filename : tentangKami.gambar;
    
    const tentangKamiData = {
      judul,
      konten,
      jenis,
      gambar,
      status
    };
    
    await TentangKami.update(req.params.id, tentangKamiData);
    req.flash('success_msg', 'Data tentang kami berhasil diperbarui');
    res.redirect('/admin/tentangkami');
  } catch (error) {
    console.error('Update Tentang Kami Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data tentang kami');
    res.redirect(`/admin/tentangkami/edit/${req.params.id}`);
  }
});

// Delete Tentang Kami
router.post('/tentangkami/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const tentangKami = await TentangKami.findById(req.params.id);
    
    if (!tentangKami) {
      req.flash('error_msg', 'Data tentang kami tidak ditemukan');
      return res.redirect('/admin/tentangkami');
    }
    
    // Delete image file if exists
    if (tentangKami.gambar) {
      const imagePath = path.join(__dirname, '../public', tentangKami.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await TentangKami.delete(req.params.id);
    req.flash('success_msg', 'Data tentang kami berhasil dihapus');
    res.redirect('/admin/tentangkami');
  } catch (error) {
    console.error('Delete Tentang Kami Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data tentang kami');
    res.redirect('/admin/tentangkami');
  }
});

module.exports = router;