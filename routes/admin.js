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
const Pendaftaran = require('../models/Pendaftaran');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// ===== DASHBOARD ROUTES =====

// Dashboard
router.get('/dashboard', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    // Get counts for dashboard
    const pendaftaranCount = await Pendaftaran.count();
    const akademikCount = await Akademik.count();
    const informasiCount = await Informasi.count();
    const kegiatanCount = await Kegiatan.count();
    const tentangKamiCount = await TentangKami.count();
    
    // Get latest pendaftaran
    const latestPendaftaran = await Pendaftaran.findLatest(5);
    
    res.render('admin/dashboard', {
      title: 'Dashboard Admin - Baitul Jannah Islamic School',
      description: 'Dashboard admin Baitul Jannah Islamic School',
      user: req.user,
      counts: {
        pendaftaran: pendaftaranCount,
        akademik: akademikCount,
        informasi: informasiCount,
        kegiatan: kegiatanCount,
        tentangKami: tentangKamiCount
      },
      latestPendaftaran
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
    console.error('List Akademik Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data akademik');
    res.redirect('/admin/dashboard');
  }
});

// Add Akademik Form
router.get('/akademik/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/akademik/tambah', {
    title: 'Tambah Akademik - Baitul Jannah Islamic School',
    description: 'Tambah data akademik Baitul Jannah Islamic School',
    user: req.user
  });
});

// Add Akademik Process
router.post('/akademik/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, jenjang } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    
    await Akademik.create({
      judul,
      deskripsi,
      jenjang,
      gambar
    });
    
    req.flash('success_msg', 'Data akademik berhasil ditambahkan');
    res.redirect('/admin/akademik');
  } catch (error) {
    console.error('Add Akademik Error:', error);
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
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit akademik');
    res.redirect('/admin/akademik');
  }
});

// Update Akademik Process
router.post('/akademik/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, jenjang } = req.body;
    const akademik = await Akademik.findById(req.params.id);
    
    if (!akademik) {
      req.flash('error_msg', 'Data akademik tidak ditemukan');
      return res.redirect('/admin/akademik');
    }
    
    let gambar = akademik.gambar;
    
    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (akademik.gambar) {
        const oldImagePath = path.join(__dirname, '../public', akademik.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      gambar = `/uploads/${req.file.filename}`;
    }
    
    await Akademik.update(req.params.id, {
      judul,
      deskripsi,
      jenjang,
      gambar
    });
    
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

// ===== PENDAFTARAN ROUTES =====

// List Pendaftaran
router.get('/pendaftaran/daftar', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const pendaftaran = await Pendaftaran.findAll();
    res.render('admin/pendaftaran/index', {
      title: 'Kelola Pendaftaran - Baitul Jannah Islamic School',
      description: 'Kelola data pendaftaran Baitul Jannah Islamic School',
      user: req.user,
      pendaftaran,
      jenjangFilter: undefined,
      statusFilter: undefined
    });
  } catch (error) {
    console.error('List Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data pendaftaran');
    res.redirect('/admin/dashboard');
  }
});

// View Pendaftaran Detail
router.get('/pendaftaran/detail/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const pendaftaran = await Pendaftaran.findById(req.params.id);
    
    if (!pendaftaran) {
      req.flash('error_msg', 'Data pendaftaran tidak ditemukan');
      return res.redirect('/admin/pendaftaran/daftar');
    }
    
    res.render('admin/pendaftaran/detail', {
      title: 'Detail Pendaftaran - Baitul Jannah Islamic School',
      description: 'Detail data pendaftaran Baitul Jannah Islamic School',
      user: req.user,
      pendaftaran
    });
  } catch (error) {
    console.error('View Pendaftaran Detail Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat detail pendaftaran');
    res.redirect('/admin/pendaftaran/daftar');
  }
});

// Update Pendaftaran Status
router.post('/pendaftaran/status/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const pendaftaran = await Pendaftaran.findById(req.params.id);
    
    if (!pendaftaran) {
      req.flash('error_msg', 'Data pendaftaran tidak ditemukan');
      return res.redirect('/admin/pendaftaran/daftar');
    }
    
    await Pendaftaran.updateStatus(req.params.id, status);
    
    req.flash('success_msg', 'Status pendaftaran berhasil diperbarui');
    res.redirect(`/admin/pendaftaran/detail/${req.params.id}`);
  } catch (error) {
    console.error('Update Pendaftaran Status Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui status pendaftaran');
    res.redirect(`/admin/pendaftaran/detail/${req.params.id}`);
  }
});

// Delete Pendaftaran
router.post('/pendaftaran/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const pendaftaran = await Pendaftaran.findById(req.params.id);
    
    if (!pendaftaran) {
      req.flash('error_msg', 'Data pendaftaran tidak ditemukan');
      return res.redirect('/admin/pendaftaran/daftar');
    }
    
    // Delete uploaded files if exist
    const fileFields = ['pas_foto', 'akta_kelahiran', 'kartu_keluarga', 'rapor'];
    
    for (const field of fileFields) {
      if (pendaftaran[field]) {
        const filePath = path.join(__dirname, '../public/uploads', pendaftaran[field]);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    
    await Pendaftaran.delete(req.params.id);
    
    req.flash('success_msg', 'Data pendaftaran berhasil dihapus');
    res.redirect('/admin/pendaftaran/daftar');
  } catch (error) {
    console.error('Delete Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data pendaftaran');
    res.redirect('/admin/pendaftaran/daftar');
  }
});

// Filter Pendaftaran by Jenjang
router.get('/pendaftaran/filter/jenjang/:jenjang', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const pendaftaran = await Pendaftaran.findByJenjang(req.params.jenjang);
    
    res.render('admin/pendaftaran/index', {
      title: `Pendaftaran ${req.params.jenjang} - Baitul Jannah Islamic School`,
      description: `Data pendaftaran jenjang ${req.params.jenjang} Baitul Jannah Islamic School`,
      user: req.user,
      pendaftaran,
      jenjangFilter: req.params.jenjang
    });
  } catch (error) {
    console.error('Filter Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memfilter data pendaftaran');
    res.redirect('/admin/pendaftaran/daftar');
  }
});

// Filter Pendaftaran by Status
router.get('/pendaftaran/filter/status/:status', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const pendaftaran = await Pendaftaran.findByStatus(req.params.status);
    
    res.render('admin/pendaftaran/index', {
      title: `Pendaftaran Status ${req.params.status} - Baitul Jannah Islamic School`,
      description: `Data pendaftaran status ${req.params.status} Baitul Jannah Islamic School`,
      user: req.user,
      pendaftaran,
      statusFilter: req.params.status
    });
  } catch (error) {
    console.error('Filter Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memfilter data pendaftaran');
    res.redirect('/admin/pendaftaran/daftar');
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
    console.error('List Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data informasi');
    res.redirect('/admin/dashboard');
  }
});

// Add Informasi Form
router.get('/informasi/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/informasi/tambah', {
    title: 'Tambah Informasi - Baitul Jannah Islamic School',
    description: 'Tambah data informasi Baitul Jannah Islamic School',
    user: req.user
  });
});

// Add Informasi Process
router.post('/informasi/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    
    await Informasi.create({
      judul,
      deskripsi,
      kategori,
      gambar
    });
    
    req.flash('success_msg', 'Data informasi berhasil ditambahkan');
    res.redirect('/admin/informasi');
  } catch (error) {
    console.error('Add Informasi Error:', error);
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
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit informasi');
    res.redirect('/admin/informasi');
  }
});

// Update Informasi Process
router.post('/informasi/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;
    const informasi = await Informasi.findById(req.params.id);
    
    if (!informasi) {
      req.flash('error_msg', 'Data informasi tidak ditemukan');
      return res.redirect('/admin/informasi');
    }
    
    let gambar = informasi.gambar;
    
    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (informasi.gambar) {
        const oldImagePath = path.join(__dirname, '../public', informasi.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      gambar = `/uploads/${req.file.filename}`;
    }
    
    await Informasi.update(req.params.id, {
      judul,
      deskripsi,
      kategori,
      gambar
    });
    
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
    
    // Delete image file if exists
    if (informasi.gambar) {
      const imagePath = path.join(__dirname, '../public', informasi.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
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
    console.error('List Kegiatan Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data kegiatan');
    res.redirect('/admin/dashboard');
  }
});

// Add Kegiatan Form
router.get('/kegiatan/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/kegiatan/tambah', {
    title: 'Tambah Kegiatan - Baitul Jannah Islamic School',
    description: 'Tambah data kegiatan Baitul Jannah Islamic School',
    user: req.user
  });
});

// Add Kegiatan Process
router.post('/kegiatan/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    
    await Kegiatan.create({
      judul,
      deskripsi,
      kategori,
      gambar
    });
    
    req.flash('success_msg', 'Data kegiatan berhasil ditambahkan');
    res.redirect('/admin/kegiatan');
  } catch (error) {
    console.error('Add Kegiatan Error:', error);
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
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit kegiatan');
    res.redirect('/admin/kegiatan');
  }
});

// Update Kegiatan Process
router.post('/kegiatan/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;
    const kegiatan = await Kegiatan.findById(req.params.id);
    
    if (!kegiatan) {
      req.flash('error_msg', 'Data kegiatan tidak ditemukan');
      return res.redirect('/admin/kegiatan');
    }
    
    let gambar = kegiatan.gambar;
    
    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (kegiatan.gambar) {
        const oldImagePath = path.join(__dirname, '../public', kegiatan.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      gambar = `/uploads/${req.file.filename}`;
    }
    
    await Kegiatan.update(req.params.id, {
      judul,
      deskripsi,
      kategori,
      gambar
    });
    
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
    console.error('List Tentang Kami Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data tentang kami');
    res.redirect('/admin/dashboard');
  }
});

// Add Tentang Kami Form
router.get('/tentangkami/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/tentangkami/tambah', {
    title: 'Tambah Tentang Kami - Baitul Jannah Islamic School',
    description: 'Tambah data tentang kami Baitul Jannah Islamic School',
    user: req.user
  });
});

// Add Tentang Kami Process
router.post('/tentangkami/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    
    await TentangKami.create({
      judul,
      deskripsi,
      kategori,
      gambar
    });
    
    req.flash('success_msg', 'Data tentang kami berhasil ditambahkan');
    res.redirect('/admin/tentangkami');
  } catch (error) {
    console.error('Add Tentang Kami Error:', error);
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
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit tentang kami');
    res.redirect('/admin/tentangkami');
  }
});

// Update Tentang Kami Process
router.post('/tentangkami/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;
    const tentangKami = await TentangKami.findById(req.params.id);
    
    if (!tentangKami) {
      req.flash('error_msg', 'Data tentang kami tidak ditemukan');
      return res.redirect('/admin/tentangkami');
    }
    
    let gambar = tentangKami.gambar;
    
    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (tentangKami.gambar) {
        const oldImagePath = path.join(__dirname, '../public', tentangKami.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      gambar = `/uploads/${req.file.filename}`;
    }
    
    await TentangKami.update(req.params.id, {
      judul,
      deskripsi,
      kategori,
      gambar
    });
    
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