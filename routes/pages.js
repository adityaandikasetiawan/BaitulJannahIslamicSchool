const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Pendaftaran = require('../models/Pendaftaran');

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
router.get('/daftarspmb', (req, res) => {
  res.render('akademik/daftarspmb', {
    title: 'Daftar SPMB - Baitul Jannah Islamic School',
    description: 'Formulir Pendaftaran SPMB Baitul Jannah Islamic School',
      });
});

// Proses pendaftaran SPMB
router.post('/daftarspmb', upload.fields([
  { name: 'pas_foto', maxCount: 1 },
  { name: 'akta_kelahiran', maxCount: 1 },
  { name: 'kartu_keluarga', maxCount: 1 },
  { name: 'rapor', maxCount: 1 }
]), async (req, res) => {
  try {
    const pendaftaranData = {
      nama_lengkap: req.body.nama_lengkap,
      jenis_kelamin: req.body.jenis_kelamin,
      tempat_lahir: req.body.tempat_lahir,
      tanggal_lahir: req.body.tanggal_lahir,
      nik: req.body.nik,
      agama: req.body.agama,
      alamat: req.body.alamat,
      nomor_telepon: req.body.nomor_telepon,
      email: req.body.email,
      nama_ayah: req.body.nama_ayah,
      pekerjaan_ayah: req.body.pekerjaan_ayah,
      nomor_telepon_ayah: req.body.nomor_telepon_ayah,
      nama_ibu: req.body.nama_ibu,
      pekerjaan_ibu: req.body.pekerjaan_ibu,
      nomor_telepon_ibu: req.body.nomor_telepon_ibu,
      nama_wali: req.body.nama_wali || null,
      hubungan_wali: req.body.hubungan_wali || null,
      jenjang: req.body.jenjang,
      asal_sekolah: req.body.asal_sekolah,
      tahun_lulus: req.body.tahun_lulus || '',
      prestasi: req.body.prestasi || '',
      status: 'pending'
    };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.pas_foto) {
        pendaftaranData.pas_foto = '/uploads/' + req.files.pas_foto[0].filename;
      }
      if (req.files.akta_kelahiran) {
        pendaftaranData.akta_kelahiran = '/uploads/' + req.files.akta_kelahiran[0].filename;
      }
      if (req.files.kartu_keluarga) {
        pendaftaranData.kartu_keluarga = '/uploads/' + req.files.kartu_keluarga[0].filename;
      }
      if (req.files.rapor) {
        pendaftaranData.rapor = '/uploads/' + req.files.rapor[0].filename;
      }
    }
    
    // Simpan data pendaftaran ke database
    const pendaftaranId = await Pendaftaran.create(pendaftaranData);
    
    if (pendaftaranId) {
      req.flash('success_msg', 'Pendaftaran berhasil dikirim. Silakan tunggu informasi selanjutnya.');
      res.redirect('/admin/pendaftaran/daftar');
    } else {
      req.flash('error_msg', 'Terjadi kesalahan saat mengirim pendaftaran');
      res.redirect('/daftarspmb');
    }
  } catch (error) {
    console.error('Pendaftaran Error:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat mengirim pendaftaran');
    res.redirect('/daftarspmb');
  }
});

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