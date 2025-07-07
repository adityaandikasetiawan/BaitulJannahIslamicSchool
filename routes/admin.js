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
const Beranda = require('../models/Beranda');
const Sekolah = require('../models/Sekolah');

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
      latestPendaftaran,
      path: req.path
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
      akademik,
      path: req.path
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
    user: req.user,
    path: req.path
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
      akademik,
      path: req.path
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
    
// ===== BERANDA ROUTES =====

// List Beranda
router.get('/beranda', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const carousels = await Beranda.getAllCarousel();
    const visions = await Beranda.getAllVision();
    const about = await Beranda.getAbout();
    const stats = await Beranda.getStats();
    
    res.render('admin/beranda/index', {
      title: 'Kelola Beranda - Baitul Jannah Islamic School',
      description: 'Kelola konten beranda Baitul Jannah Islamic School',
      user: req.user,
      carousels,
      visions,
      about,
      stats,
      path: req.path
    });
  } catch (error) {
    console.error('List Beranda Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data beranda');
    res.redirect('/admin/dashboard');
  }
});

// Update Beranda
router.get('/beranda/update', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const carousels = await Beranda.getAllCarousel();
    const visions = await Beranda.getAllVision();
    const about = await Beranda.getAbout();
    const stats = await Beranda.getStats();
    
    res.render('admin/beranda/update', {
      title: 'Update Beranda - Baitul Jannah Islamic School',
      description: 'Update konten beranda Baitul Jannah Islamic School',
      user: req.user,
      carousels,
      visions,
      about,
      stats,
      path: req.path
    });
  } catch (error) {
    console.error('Update Beranda Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data beranda');
    res.redirect('/admin/beranda');
  }
});

// ===== CAROUSEL ROUTES =====

// Add Carousel Form
router.get('/beranda/carousel/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/beranda/carousel/tambah', {
    title: 'Tambah Carousel - Baitul Jannah Islamic School',
    description: 'Tambah data carousel beranda Baitul Jannah Islamic School',
    user: req.user,
    path: req.path
  });
});

// Add Carousel Process
router.post('/beranda/carousel/tambah', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, subjudul, deskripsi, urutan } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    
    await Beranda.createCarousel({
      judul,
      subjudul,
      deskripsi,
      gambar,
      urutan: parseInt(urutan) || 1
    });
    
    req.flash('success_msg', 'Data carousel berhasil ditambahkan');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Add Carousel Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan data carousel');
    res.redirect('/admin/beranda/carousel/tambah');
  }
});

// Edit Carousel Form
router.get('/beranda/carousel/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const carousel = await Beranda.findCarouselById(req.params.id);
    
    if (!carousel) {
      req.flash('error_msg', 'Data carousel tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    res.render('admin/beranda/carousel/edit', {
      title: 'Edit Carousel - Baitul Jannah Islamic School',
      description: 'Edit data carousel beranda Baitul Jannah Islamic School',
      user: req.user,
      carousel,
      path: req.path
    });
  } catch (error) {
    console.error('Edit Carousel Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit carousel');
    res.redirect('/admin/beranda');
  }
});

// Update Carousel Process
router.post('/beranda/carousel/edit/:id', ensureAuthenticated, isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, subjudul, deskripsi, urutan } = req.body;
    const carousel = await Beranda.findCarouselById(req.params.id);
    
    if (!carousel) {
      req.flash('error_msg', 'Data carousel tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    let gambar = carousel.gambar;
    
    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (carousel.gambar) {
        const oldImagePath = path.join(__dirname, '../public', carousel.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      gambar = `/uploads/${req.file.filename}`;
    }
    
    await Beranda.updateCarousel(req.params.id, {
      judul,
      subjudul,
      deskripsi,
      gambar,
      urutan: parseInt(urutan) || 1
    });
    
    req.flash('success_msg', 'Data carousel berhasil diperbarui');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Update Carousel Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data carousel');
    res.redirect(`/admin/beranda/carousel/edit/${req.params.id}`);
  }
});

// Delete Carousel
router.post('/beranda/carousel/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const carousel = await Beranda.findCarouselById(req.params.id);
    
    if (!carousel) {
      req.flash('error_msg', 'Data carousel tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    // Delete image file if exists
    if (carousel.gambar) {
      const imagePath = path.join(__dirname, '../public', carousel.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Beranda.deleteCarousel(req.params.id);
    
    req.flash('success_msg', 'Data carousel berhasil dihapus');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Delete Carousel Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data carousel');
    res.redirect('/admin/beranda');
  }
});

// Update Carousel Page
router.get('/beranda/carousel/update', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const carousels = await Beranda.getAllCarousel();
    const settings = await Beranda.getCarouselSettings();
    
    res.render('admin/beranda/carousel/update', {
      title: 'Update Banner Carousel - Baitul Jannah Islamic School',
      description: 'Update pengaturan banner carousel beranda Baitul Jannah Islamic School',
      user: req.user,
      carousels,
      settings
    ,
      path: req.path});
  } catch (error) {
    console.error('Update Carousel Page Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat halaman update carousel');
    res.redirect('/admin/beranda');
  }
});

// Update Carousel Settings
router.post('/beranda/carousel/settings', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { autoplay, interval, showIndicators, showControls } = req.body;
    
    await Beranda.updateCarouselSettings({
      autoplay: autoplay === 'true',
      interval: parseInt(interval) || 5000,
      showIndicators: showIndicators === 'true',
      showControls: showControls === 'true'
    });
    
    req.flash('success_msg', 'Pengaturan carousel berhasil diperbarui');
    res.redirect('/admin/beranda/carousel/update');
  } catch (error) {
    console.error('Update Carousel Settings Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui pengaturan carousel');
    res.redirect('/admin/beranda/carousel/update');
  }
});

// ===== VISION ROUTES =====

// Add Vision Form
router.get('/beranda/vision/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/beranda/vision/tambah', {
    title: 'Tambah Vision - Baitul Jannah Islamic School',
    description: 'Tambah data vision beranda Baitul Jannah Islamic School',
    user: req.user
  ,
      path: req.path});
});

// Add Vision Process
router.post('/beranda/vision/tambah', ensureAuthenticated, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { judul, link, urutan } = req.body;
    const icon = req.file ? `/uploads/${req.file.filename}` : null;
    
    await Beranda.createVision({
      judul,
      icon,
      link,
      urutan: parseInt(urutan) || 1
    });
    
    req.flash('success_msg', 'Data vision berhasil ditambahkan');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Add Vision Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan data vision');
    res.redirect('/admin/beranda/vision/tambah');
  }
});

// Edit Vision Form
router.get('/beranda/vision/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const vision = await Beranda.findVisionById(req.params.id);
    
    if (!vision) {
      req.flash('error_msg', 'Data vision tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    res.render('admin/beranda/vision/edit', {
      title: 'Edit Vision - Baitul Jannah Islamic School',
      description: 'Edit data vision beranda Baitul Jannah Islamic School',
      user: req.user,
      vision
    ,
      path: req.path});
  } catch (error) {
    console.error('Edit Vision Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit vision');
    res.redirect('/admin/beranda');
  }
});

// Update Vision Process
router.post('/beranda/vision/edit/:id', ensureAuthenticated, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { judul, link, urutan } = req.body;
    const vision = await Beranda.findVisionById(req.params.id);
    
    if (!vision) {
      req.flash('error_msg', 'Data vision tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    let icon = vision.icon;
    
    // If new icon uploaded
    if (req.file) {
      // Delete old icon if exists
      if (vision.icon) {
        const oldIconPath = path.join(__dirname, '../public', vision.icon);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }
      
      icon = `/uploads/${req.file.filename}`;
    }
    
    await Beranda.updateVision(req.params.id, {
      judul,
      icon,
      link,
      urutan: parseInt(urutan) || 1
    });
    
    req.flash('success_msg', 'Data vision berhasil diperbarui');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Update Vision Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data vision');
    res.redirect(`/admin/beranda/vision/edit/${req.params.id}`);
  }
});

// Delete Vision
router.post('/beranda/vision/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const vision = await Beranda.findVisionById(req.params.id);
    
    if (!vision) {
      req.flash('error_msg', 'Data vision tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    // Delete icon file if exists
    if (vision.icon) {
      const iconPath = path.join(__dirname, '../public', vision.icon);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
      }
    }
    
    await Beranda.deleteVision(req.params.id);
    
    req.flash('success_msg', 'Data vision berhasil dihapus');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Delete Vision Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus data vision');
    res.redirect('/admin/beranda');
  }
});

// ===== ABOUT ROUTES =====

// Edit About Form
router.get('/beranda/about/edit', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const about = await Beranda.getAbout();
    
    res.render('admin/beranda/about/edit', {
      title: 'Edit About - Baitul Jannah Islamic School',
      description: 'Edit data about beranda Baitul Jannah Islamic School',
      user: req.user,
      about
    ,
      path: req.path});
  } catch (error) {
    console.error('Edit About Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit about');
    res.redirect('/admin/beranda');
  }
});

// Update About Process
router.post('/beranda/about/edit', ensureAuthenticated, isAdmin, upload.fields([
  { name: 'gambar1', maxCount: 1 },
  { name: 'gambar2', maxCount: 1 },
  { name: 'gambar3', maxCount: 1 }
]), async (req, res) => {
  try {
    const { judul, subjudul, deskripsi } = req.body;
    const about = await Beranda.getAbout();
    
    let gambar1 = about ? about.gambar1 : null;
    let gambar2 = about ? about.gambar2 : null;
    let gambar3 = about ? about.gambar3 : null;
    
    // If new images uploaded
    if (req.files) {
      if (req.files.gambar1) {
        // Delete old image if exists
        if (about && about.gambar1) {
          const oldImagePath = path.join(__dirname, '../public', about.gambar1);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        gambar1 = `/uploads/${req.files.gambar1[0].filename}`;
      }
      
      if (req.files.gambar2) {
        // Delete old image if exists
        if (about && about.gambar2) {
          const oldImagePath = path.join(__dirname, '../public', about.gambar2);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        gambar2 = `/uploads/${req.files.gambar2[0].filename}`;
      }
      
      if (req.files.gambar3) {
        // Delete old image if exists
        if (about && about.gambar3) {
          const oldImagePath = path.join(__dirname, '../public', about.gambar3);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        gambar3 = `/uploads/${req.files.gambar3[0].filename}`;
      }
    }
    
    await Beranda.updateAbout({
      judul,
      subjudul,
      deskripsi,
      gambar1,
      gambar2,
      gambar3
    });
    
    req.flash('success_msg', 'Data about berhasil diperbarui');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Update About Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data about');
    res.redirect('/admin/beranda/about/edit');
  }
});

// ===== STATS ROUTES =====

// Edit Stats Form
router.get('/beranda/stats/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = await Beranda.getStats();
    const stat = stats.find(s => s.id == req.params.id);
    
    if (!stat) {
      req.flash('error_msg', 'Data statistik tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    res.render('admin/beranda/stats/edit', {
      title: 'Edit Statistik - Baitul Jannah Islamic School',
      description: 'Edit data statistik beranda Baitul Jannah Islamic School',
      user: req.user,
      stat
    ,
      path: req.path});
  } catch (error) {
    console.error('Edit Stats Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit statistik');
    res.redirect('/admin/beranda');
  }
});

// Update Stats Process
router.post('/beranda/stats/edit/:id', ensureAuthenticated, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { judul, nilai } = req.body;
    const stats = await Beranda.getStats();
    const stat = stats.find(s => s.id == req.params.id);
    
    if (!stat) {
      req.flash('error_msg', 'Data statistik tidak ditemukan');
      return res.redirect('/admin/beranda');
    }
    
    let icon = stat.icon;
    
    // If new icon uploaded
    if (req.file) {
      // Delete old icon if exists
      if (stat.icon) {
        const oldIconPath = path.join(__dirname, '../public', stat.icon);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }
      
      icon = `/uploads/${req.file.filename}`;
    }
    
    await Beranda.updateStats(req.params.id, {
      judul,
      nilai,
      icon
    });
    
    req.flash('success_msg', 'Data statistik berhasil diperbarui');
    res.redirect('/admin/beranda');
  } catch (error) {
    console.error('Update Stats Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui data statistik');
    res.redirect(`/admin/beranda/stats/edit/${req.params.id}`);
  }
});

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

// Redirect from /pendaftaran to /pendaftaran/daftar
router.get('/pendaftaran', ensureAuthenticated, isAdmin, (req, res) => {
  res.redirect('/admin/pendaftaran/daftar');
});

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
      statusFilter: undefined,
      path: '/admin/pendaftaran',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
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
      pendaftaran,
      path: '/admin/pendaftaran',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
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
    const { jenjang } = req.params;
    let pendaftaran;
    
    if (jenjang === 'all') {
      pendaftaran = await Pendaftaran.findAll();
    } else {
      pendaftaran = await Pendaftaran.findByJenjang(jenjang);
    }
    
    res.render('admin/pendaftaran/index', {
      title: `Pendaftaran ${jenjang} - Baitul Jannah Islamic School`,
      description: `Data pendaftaran jenjang ${jenjang} Baitul Jannah Islamic School`,
      user: req.user,
      pendaftaran,
      jenjangFilter: jenjang,
      statusFilter: undefined,
      path: '/admin/pendaftaran',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
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
    const { status } = req.params;
    let pendaftaran;
    
    if (status === 'all') {
      pendaftaran = await Pendaftaran.findAll();
    } else {
      pendaftaran = await Pendaftaran.findByStatus(status);
    }
    
    res.render('admin/pendaftaran/index', {
      title: `Pendaftaran Status ${status} - Baitul Jannah Islamic School`,
      description: `Data pendaftaran status ${status} Baitul Jannah Islamic School`,
      user: req.user,
      pendaftaran,
      jenjangFilter: undefined,
      statusFilter: status,
      path: '/admin/pendaftaran',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Filter Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memfilter data pendaftaran');
    res.redirect('/admin/pendaftaran/daftar');
  }
});

// Syarat Pendaftaran - List
router.get('/pendaftaran/syarat', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const SyaratPendaftaran = require('../models/SyaratPendaftaran');
    const syaratList = await SyaratPendaftaran.findAll();
    
    res.render('admin/pendaftaran/syarat', {
      title: 'Syarat Pendaftaran - Baitul Jannah Islamic School',
      description: 'Syarat pendaftaran siswa baru Baitul Jannah Islamic School',
      user: req.user,
      path: '/admin/pendaftaran',
      syaratList,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Syarat Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat halaman syarat pendaftaran');
    res.redirect('/admin/pendaftaran/daftar');
  }
});

// Syarat Pendaftaran - Tambah Form
router.get('/pendaftaran/syarat/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  try {
    res.render('admin/pendaftaran/syarat-form', {
      title: 'Tambah Syarat Pendaftaran - Baitul Jannah Islamic School',
      description: 'Tambah syarat pendaftaran siswa baru Baitul Jannah Islamic School',
      user: req.user,
      path: '/admin/pendaftaran',
      syarat: {},
      action: 'tambah',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Tambah Syarat Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form tambah syarat pendaftaran');
    res.redirect('/admin/pendaftaran/syarat');
  }
});

// Syarat Pendaftaran - Tambah Process
router.post('/pendaftaran/syarat/tambah', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const SyaratPendaftaran = require('../models/SyaratPendaftaran');
    const { jenjang, persyaratan_umum, tahapan_seleksi, biaya_pendaftaran, informasi_tambahan } = req.body;
    
    await SyaratPendaftaran.create({
      jenjang,
      persyaratan_umum,
      tahapan_seleksi,
      biaya_pendaftaran,
      informasi_tambahan
    });
    
    req.flash('success_msg', 'Syarat pendaftaran berhasil ditambahkan');
    res.redirect('/admin/pendaftaran/syarat');
  } catch (error) {
    console.error('Tambah Syarat Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambahkan syarat pendaftaran');
    res.redirect('/admin/pendaftaran/syarat/tambah');
  }
});

// Syarat Pendaftaran - Edit Form
router.get('/pendaftaran/syarat/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const SyaratPendaftaran = require('../models/SyaratPendaftaran');
    const syarat = await SyaratPendaftaran.findById(req.params.id);
    
    if (!syarat) {
      req.flash('error_msg', 'Syarat pendaftaran tidak ditemukan');
      return res.redirect('/admin/pendaftaran/syarat');
    }
    
    res.render('admin/pendaftaran/syarat-form', {
      title: 'Edit Syarat Pendaftaran - Baitul Jannah Islamic School',
      description: 'Edit syarat pendaftaran siswa baru Baitul Jannah Islamic School',
      user: req.user,
      path: '/admin/pendaftaran',
      syarat,
      action: 'edit',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Edit Syarat Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat form edit syarat pendaftaran');
    res.redirect('/admin/pendaftaran/syarat');
  }
});

// Syarat Pendaftaran - Edit Process
router.post('/pendaftaran/syarat/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const SyaratPendaftaran = require('../models/SyaratPendaftaran');
    const { jenjang, persyaratan_umum, tahapan_seleksi, biaya_pendaftaran, informasi_tambahan } = req.body;
    
    const syarat = await SyaratPendaftaran.findById(req.params.id);
    
    if (!syarat) {
      req.flash('error_msg', 'Syarat pendaftaran tidak ditemukan');
      return res.redirect('/admin/pendaftaran/syarat');
    }
    
    await SyaratPendaftaran.update(req.params.id, {
      jenjang,
      persyaratan_umum,
      tahapan_seleksi,
      biaya_pendaftaran,
      informasi_tambahan
    });
    
    req.flash('success_msg', 'Syarat pendaftaran berhasil diperbarui');
    res.redirect('/admin/pendaftaran/syarat');
  } catch (error) {
    console.error('Update Syarat Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui syarat pendaftaran');
    res.redirect(`/admin/pendaftaran/syarat/edit/${req.params.id}`);
  }
});

// Syarat Pendaftaran - Delete
router.post('/pendaftaran/syarat/hapus/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const SyaratPendaftaran = require('../models/SyaratPendaftaran');
    const syarat = await SyaratPendaftaran.findById(req.params.id);
    
    if (!syarat) {
      req.flash('error_msg', 'Syarat pendaftaran tidak ditemukan');
      return res.redirect('/admin/pendaftaran/syarat');
    }
    
    await SyaratPendaftaran.delete(req.params.id);
    
    req.flash('success_msg', 'Syarat pendaftaran berhasil dihapus');
    res.redirect('/admin/pendaftaran/syarat');
  } catch (error) {
    console.error('Delete Syarat Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus syarat pendaftaran');
    res.redirect('/admin/pendaftaran/syarat');
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
    ,
      path: req.path});
  } catch (error) {
    console.error('List Informasi Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data informasi');
    res.redirect('/admin/dashboard');
  }
});

// List Berita
router.get('/informasi/berita', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const berita = await Berita.findAll();
    res.render('admin/informasi/berita', {
      title: 'Berita - Admin Dashboard',
      description: 'Kelola berita Baitul Jannah Islamic School',
      user: req.user,
      berita
    ,
      path: req.path});
  } catch (error) {
    console.error('List Berita Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data berita');
    res.redirect('/admin/dashboard');
  }
});

// List Pengumuman
router.get('/informasi/pengumuman', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const pengumuman = await Pengumuman.findAll();
    res.render('admin/informasi/pengumuman', {
      title: 'Pengumuman - Admin Dashboard',
      description: 'Kelola pengumuman Baitul Jannah Islamic School',
      user: req.user,
      pengumuman,
      path: req.path
    });
  } catch (error) {
    console.error('List Pengumuman Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data pengumuman');
    res.redirect('/admin/dashboard');
  }
});

// List Agenda
router.get('/informasi/agenda', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const agenda = await Agenda.list();
    res.render('admin/informasi/agenda', {
      title: 'Agenda - Admin Dashboard',
      description: 'Kelola agenda Baitul Jannah Islamic School',
      user: req.user,
      agenda,
      path: req.path
    });
  } catch (error) {
    console.error('List Agenda Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat data agenda');
    res.redirect('/admin/dashboard');
  }
});

// Add Informasi Form
router.get('/informasi/tambah', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin/informasi/tambah', {
    title: 'Tambah Informasi - Baitul Jannah Islamic School',
    description: 'Tambah data informasi Baitul Jannah Islamic School',
    user: req.user,
    path: req.path
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
      informasi,
      path: req.path
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
      kegiatan,
      path: req.path
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
    user: req.user,
    path: req.path
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
    ,
      path: req.path});
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
    ,
      path: req.path});
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
  ,
      path: req.path});
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
    ,
      path: req.path});
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

// ===== PROFIL SEKOLAH ROUTES =====

// Profile PGIT-TKIT
router.get('/profile/pgit', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const sekolah = await Sekolah.findByJenjang('PGIT-TKIT');
    res.render('admin/profile/pgit', {
      title: 'Profile PGIT-TKIT - Baitul Jannah Islamic School',
      description: 'Kelola profil PGIT-TKIT Baitul Jannah Islamic School',
      user: req.user,
      sekolah: sekolah || {}
    });
  } catch (error) {
    console.error('Profile PGIT Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat profil PGIT-TKIT');
    res.redirect('/admin/dashboard');
  }
});

// Profile SDIT
router.get('/profile/sdit', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const sekolah = await Sekolah.findByJenjang('SDIT');
    res.render('admin/profile/sdit', {
      title: 'Profile SDIT - Baitul Jannah Islamic School',
      description: 'Kelola profil SDIT Baitul Jannah Islamic School',
      user: req.user,
      sekolah: sekolah || {}
    });
  } catch (error) {
    console.error('Profile SDIT Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat profil SDIT');
    res.redirect('/admin/dashboard');
  }
});

// Profile SMPIT
router.get('/profile/smpit', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const sekolah = await Sekolah.findByJenjang('SMPIT');
    res.render('admin/profile/smpit', {
      title: 'Profile SMPIT - Baitul Jannah Islamic School',
      description: 'Kelola profil SMPIT Baitul Jannah Islamic School',
      user: req.user,
      sekolah: sekolah || {}
    });
  } catch (error) {
    console.error('Profile SMPIT Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat profil SMPIT');
    res.redirect('/admin/dashboard');
  }
});

// Profile SMAIT
router.get('/profile/smait', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const sekolah = await Sekolah.findByJenjang('SMAIT');
    res.render('admin/profile/smait', {
      title: 'Profile SMAIT - Baitul Jannah Islamic School',
      description: 'Kelola profil SMAIT Baitul Jannah Islamic School',
      user: req.user,
      sekolah: sekolah || {}
    });
  } catch (error) {
    console.error('Profile SMAIT Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat profil SMAIT');
    res.redirect('/admin/dashboard');
  }
});

// Profile SLBIT
router.get('/profile/slbit', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const sekolah = await Sekolah.findByJenjang('SLBIT');
    res.render('admin/profile/slbit', {
      title: 'Profile SLBIT - Baitul Jannah Islamic School',
      description: 'Kelola profil SLBIT Baitul Jannah Islamic School',
      user: req.user,
      sekolah: sekolah || {}
    });
  } catch (error) {
    console.error('Profile SLBIT Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memuat profil SLBIT');
    res.redirect('/admin/dashboard');
  }
});

// Update Profile Process (Universal for all jenjang)
router.post('/profile/update/:jenjang', ensureAuthenticated, isAdmin, upload.fields([{name: 'logo', maxCount: 1}, {name: 'gambar_utama', maxCount: 1}]), async (req, res) => {
  try {
    const { jenjang } = req.params;
    const { nama, visi, misi, tujuan, sejarah, kepala_sekolah, alamat, telepon, email, website, status } = req.body;
    
    // Validate jenjang
    const validJenjang = ['PGIT-TKIT', 'SDIT', 'SMPIT', 'SMAIT', 'SLBIT'];
    if (!validJenjang.includes(jenjang)) {
      req.flash('error_msg', 'Jenjang tidak valid');
      return res.redirect('/admin/dashboard');
    }
    
    const existingSekolah = await Sekolah.findByJenjang(jenjang);
    
    let logo = existingSekolah ? existingSekolah.logo : null;
    let gambar_utama = existingSekolah ? existingSekolah.gambar_utama : null;
    
    // Handle logo upload
    if (req.files && req.files.logo) {
      // Delete old logo if exists
      if (existingSekolah && existingSekolah.logo) {
        const oldLogoPath = path.join(__dirname, '../public', existingSekolah.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      logo = `/uploads/${req.files.logo[0].filename}`;
    }
    
    // Handle gambar_utama upload
    if (req.files && req.files.gambar_utama) {
      // Delete old gambar_utama if exists
      if (existingSekolah && existingSekolah.gambar_utama) {
        const oldGambarPath = path.join(__dirname, '../public', existingSekolah.gambar_utama);
        if (fs.existsSync(oldGambarPath)) {
          fs.unlinkSync(oldGambarPath);
        }
      }
      gambar_utama = `/uploads/${req.files.gambar_utama[0].filename}`;
    }
    
    const sekolahData = {
      jenjang,
      nama,
      visi,
      misi,
      tujuan,
      sejarah,
      kepala_sekolah,
      alamat,
      telepon,
      email,
      website,
      logo,
      gambar_utama,
      status: status || 'aktif',
      created_by: req.user.id
    };
    
    if (existingSekolah) {
      await Sekolah.updateByJenjang(jenjang, sekolahData);
      req.flash('success_msg', `Profil ${jenjang} berhasil diperbarui`);
    } else {
      await Sekolah.create(sekolahData);
      req.flash('success_msg', `Profil ${jenjang} berhasil dibuat`);
    }
    
    res.redirect(`/admin/profile/${jenjang.toLowerCase().replace('-', '')}`);
  } catch (error) {
    console.error('Update Profile Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat memperbarui profil');
    res.redirect('/admin/dashboard');
  }
});

module.exports = router;