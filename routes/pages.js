const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Tentang Kami Routes
router.get('/visimisi', (req, res) => {
  res.render('visimisi', {
    title: 'Visi dan Misi - Baitul Jannah Islamic School',
    description: 'Visi dan Misi Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/kepengurusan', (req, res) => {
  res.render('kepengurusan', {
    title: 'Kepengurusan - Baitul Jannah Islamic School',
    description: 'Struktur Kepengurusan Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/fasilitas', (req, res) => {
  res.render('fasilitas', {
    title: 'Fasilitas - Baitul Jannah Islamic School',
    description: 'Fasilitas Baitul Jannah Islamic School',
    user: req.user
  });
});

// Daftar SPMB Routes
router.get('/syaratpendaftaran', (req, res) => {
  res.render('syaratpendaftaran', {
    title: 'Syarat Pendaftaran - Baitul Jannah Islamic School',
    description: 'Syarat Pendaftaran Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/pengumuman', (req, res) => {
  res.render('pengumuman', {
    title: 'Pengumuman - Baitul Jannah Islamic School',
    description: 'Pengumuman Baitul Jannah Islamic School',
    user: req.user
  });
});

// Profile Routes
router.get('/pgit-tkit', (req, res) => {
  res.render('pgit-tkit', {
    title: 'PGIT-TKIT - Baitul Jannah Islamic School',
    description: 'PGIT-TKIT Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/sdit', (req, res) => {
  res.render('sdit', {
    title: 'SDIT - Baitul Jannah Islamic School',
    description: 'SDIT Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/smpit', (req, res) => {
  res.render('smpit', {
    title: 'SMPIT - Baitul Jannah Islamic School',
    description: 'SMPIT Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/smait', (req, res) => {
  res.render('smait', {
    title: 'SMAIT - Baitul Jannah Islamic School',
    description: 'SMAIT Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/slbit', (req, res) => {
  res.render('slbit', {
    title: 'SLBIT - Baitul Jannah Islamic School',
    description: 'SLBIT Baitul Jannah Islamic School',
    user: req.user
  });
});

// Informasi Routes
router.get('/beritaterbaru', (req, res) => {
  res.render('beritaterbaru', {
    title: 'Berita Terbaru - Baitul Jannah Islamic School',
    description: 'Berita Terbaru Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/prestasi', (req, res) => {
  res.render('prestasi', {
    title: 'Prestasi - Baitul Jannah Islamic School',
    description: 'Prestasi Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/agendasekolah', (req, res) => {
  res.render('agendasekolah', {
    title: 'Agenda Sekolah - Baitul Jannah Islamic School',
    description: 'Agenda Sekolah Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/ebuletin', (req, res) => {
  res.render('ebuletin', {
    title: 'E-Buletin - Baitul Jannah Islamic School',
    description: 'E-Buletin Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/galeri', (req, res) => {
  res.render('galeri', {
    title: 'Galeri dan Foto - Baitul Jannah Islamic School',
    description: 'Galeri dan Foto Baitul Jannah Islamic School',
    user: req.user
  });
});

// Kontak Routes
router.get('/permohonankunjungan', (req, res) => {
  res.render('permohonankunjungan', {
    title: 'Permohonan Kunjungan - Baitul Jannah Islamic School',
    description: 'Permohonan Kunjungan Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/permohonanpenelitian', (req, res) => {
  res.render('permohonanpenelitian', {
    title: 'Permohonan Penelitian - Baitul Jannah Islamic School',
    description: 'Permohonan Penelitian Baitul Jannah Islamic School',
    user: req.user
  });
});

router.get('/faq', (req, res) => {
  res.render('faq', {
    title: 'FAQ - Baitul Jannah Islamic School',
    description: 'Frequently Asked Questions Baitul Jannah Islamic School',
    user: req.user
  });
});

module.exports = router;