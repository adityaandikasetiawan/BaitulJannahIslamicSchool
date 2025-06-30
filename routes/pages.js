const express = require('express');
const router = express.Router();

// Tentang Kami Routes
router.get('/visimisi', (req, res) => {
  res.render('tentangkami/visimisi', {
    title: 'Visi dan Misi - Baitul Jannah Islamic School',
    description: 'Visi dan Misi Baitul Jannah Islamic School',
      });
});

router.get('/kepengurusan', (req, res) => {
  res.render('tentangkami/kepengurusan', {
    title: 'Kepengurusan - Baitul Jannah Islamic School',
    description: 'Struktur Kepengurusan Baitul Jannah Islamic School',
      });
});

router.get('/fasilitas', (req, res) => {
  res.render('tentangkami/fasilitas', {
    title: 'Fasilitas - Baitul Jannah Islamic School',
    description: 'Fasilitas Baitul Jannah Islamic School',
      });
});

// Daftar SPMB Routes
router.get('/syaratpendaftaran', (req, res) => {
  res.render('akademik/syaratpendaftaran', {
    title: 'Syarat Pendaftaran - Baitul Jannah Islamic School',
    description: 'Syarat Pendaftaran Baitul Jannah Islamic School',
      });
});

router.get('/pengumuman', (req, res) => {
  res.render('informasi/pengumuman', {
    title: 'Pengumuman - Baitul Jannah Islamic School',
    description: 'Pengumuman Baitul Jannah Islamic School',
      });
});

// Profile Routes
router.get('/pgit-tkit', (req, res) => {
  res.render('akademik/pgit-tkit', {
    title: 'PGIT-TKIT - Baitul Jannah Islamic School',
    description: 'PGIT-TKIT Baitul Jannah Islamic School',
      });
});

router.get('/sdit', (req, res) => {
  res.render('akademik/sdit', {
    title: 'SDIT - Baitul Jannah Islamic School',
    description: 'SDIT Baitul Jannah Islamic School',
      });
});

router.get('/smpit', (req, res) => {
  res.render('akademik/smpit', {
    title: 'SMPIT - Baitul Jannah Islamic School',
    description: 'SMPIT Baitul Jannah Islamic School',
      });
});

router.get('/smait', (req, res) => {
  res.render('akademik/smait', {
    title: 'SMAIT - Baitul Jannah Islamic School',
    description: 'SMAIT Baitul Jannah Islamic School',
      });
});

router.get('/slbit', (req, res) => {
  res.render('akademik/slbit', {
    title: 'SLBIT - Baitul Jannah Islamic School',
    description: 'SLBIT Baitul Jannah Islamic School',
      });
});

// Informasi Routes
router.get('/beritaterbaru', (req, res) => {
  res.render('informasi/beritaterbaru', {
    title: 'Berita Terbaru - Baitul Jannah Islamic School',
    description: 'Berita Terbaru Baitul Jannah Islamic School',
      });
});

router.get('/prestasi', (req, res) => {
  res.render('informasi/prestasi', {
    title: 'Prestasi - Baitul Jannah Islamic School',
    description: 'Prestasi Baitul Jannah Islamic School',
      });
});

router.get('/agendasekolah', (req, res) => {
  res.render('informasi/agendasekolah', {
    title: 'Agenda Sekolah - Baitul Jannah Islamic School',
    description: 'Agenda Sekolah Baitul Jannah Islamic School',
      });
});

router.get('/ebuletin', (req, res) => {
  res.render('informasi/ebuletin', {
    title: 'E-Buletin - Baitul Jannah Islamic School',
    description: 'E-Buletin Baitul Jannah Islamic School',
      });
});

router.get('/galeri', (req, res) => {
  res.render('informasi/galeri', {
    title: 'Galeri dan Foto - Baitul Jannah Islamic School',
    description: 'Galeri dan Foto Baitul Jannah Islamic School',
      });
});

// Kontak Routes
router.get('/permohonankunjungan', (req, res) => {
  res.render('informasi/permohonankunjungan', {
    title: 'Permohonan Kunjungan - Baitul Jannah Islamic School',
    description: 'Permohonan Kunjungan Baitul Jannah Islamic School',
      });
});

// Dauroh Qur'an Route
router.get('/daurohquran', (req, res) => {
  res.render('kegiatan/daurohquran', {
    title: 'Dauroh Qur\'an - Baitul Jannah Islamic School',
    description: 'Program Dauroh Qur\'an Baitul Jannah Islamic School',
      });
});

// Student Project Assessment Route
router.get('/studentproject', (req, res) => {
  res.render('akademik/studentproject', {
    title: 'Student Project Assessment - Baitul Jannah Islamic School',
    description: 'Program Student Project Assessment Baitul Jannah Islamic School',
      });
});

// Ekstrakurikuler Route
router.get('/ekstrakurikuler', (req, res) => {
  res.render('kegiatan/ekstrakurikuler', {
    title: 'Ekstrakurikuler - Baitul Jannah Islamic School',
    description: 'Program Ekstrakurikuler Baitul Jannah Islamic School',
      });
});

// Alumni Route
router.get('/alumni', (req, res) => {
  res.render('informasi/alumni', {
    title: 'Alumni - Baitul Jannah Islamic School',
    description: 'Alumni Baitul Jannah Islamic School',
      });
});

router.get('/permohonanpenelitian', (req, res) => {
  res.render('informasi/permohonanpenelitian', {
    title: 'Permohonan Penelitian - Baitul Jannah Islamic School',
    description: 'Permohonan Penelitian Baitul Jannah Islamic School',
      });
});

router.get('/faq', (req, res) => {
  res.render('informasi/faq', {
    title: 'FAQ - Baitul Jannah Islamic School',
    description: 'Frequently Asked Questions Baitul Jannah Islamic School',
      });
});

module.exports = router;