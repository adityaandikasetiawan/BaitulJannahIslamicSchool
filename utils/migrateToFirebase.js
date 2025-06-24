const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { db } = require('../config/firebase');

// Load environment variables
dotenv.config();

// Import MongoDB models
const UserMongo = require('../models/User');
const BeritaMongo = require('../models/Berita');
const PengumumanMongo = require('../models/Pengumuman');
const AgendaMongo = require('../models/Agenda');
const GaleriMongo = require('../models/Galeri');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Fungsi untuk migrasi data
async function migrateData() {
  try {
    // Migrasi Users
    console.log('Memulai migrasi users...');
    const users = await UserMongo.find({});
    const userPromises = users.map(async (user) => {
      const userData = {
        name: user.name,
        email: user.email,
        password: user.password, // Password sudah di-hash di MongoDB
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        isActive: user.isActive !== undefined ? user.isActive : true,
        date: user.date || new Date()
      };
      
      // Cek apakah user sudah ada di Firebase
      const existingUser = await db.collection('users')
        .where('email', '==', userData.email)
        .get();
      
      if (existingUser.empty) {
        await db.collection('users').add(userData);
        console.log(`User ${userData.email} berhasil dimigrasi`);
      } else {
        console.log(`User ${userData.email} sudah ada di Firebase, melewati...`);
      }
    });
    
    await Promise.all(userPromises);
    console.log('Migrasi users selesai!');
    
    // Migrasi Berita
    console.log('Memulai migrasi berita...');
    const berita = await BeritaMongo.find({});
    const beritaPromises = berita.map(async (item) => {
      const beritaData = {
        judul: item.judul,
        konten: item.konten,
        kategori: item.kategori,
        gambar: item.gambar || '',
        penulis: item.penulis || '',
        status: item.status || 'draft',
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      };
      
      await db.collection('berita').add(beritaData);
      console.log(`Berita ${beritaData.judul} berhasil dimigrasi`);
    });
    
    await Promise.all(beritaPromises);
    console.log('Migrasi berita selesai!');
    
    // Migrasi Pengumuman
    console.log('Memulai migrasi pengumuman...');
    const pengumuman = await PengumumanMongo.find({});
    const pengumumanPromises = pengumuman.map(async (item) => {
      const pengumumanData = {
        judul: item.judul,
        konten: item.konten,
        lampiran: item.lampiran || '',
        audiens: item.audiens || 'semua',
        tanggalMulai: item.tanggalMulai || new Date(),
        tanggalSelesai: item.tanggalSelesai || new Date(),
        status: item.status || 'draft',
        penting: item.penting || false,
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      };
      
      await db.collection('pengumuman').add(pengumumanData);
      console.log(`Pengumuman ${pengumumanData.judul} berhasil dimigrasi`);
    });
    
    await Promise.all(pengumumanPromises);
    console.log('Migrasi pengumuman selesai!');
    
    // Migrasi Agenda
    console.log('Memulai migrasi agenda...');
    const agenda = await AgendaMongo.find({});
    const agendaPromises = agenda.map(async (item) => {
      const agendaData = {
        judul: item.judul,
        deskripsi: item.deskripsi,
        lokasi: item.lokasi,
        penyelenggara: item.penyelenggara || '',
        tanggal: item.tanggal || new Date(),
        waktuMulai: item.waktuMulai || '',
        waktuSelesai: item.waktuSelesai || '',
        kategori: item.kategori || 'umum',
        gambar: item.gambar || '',
        status: item.status || 'upcoming',
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      };
      
      await db.collection('agenda').add(agendaData);
      console.log(`Agenda ${agendaData.judul} berhasil dimigrasi`);
    });
    
    await Promise.all(agendaPromises);
    console.log('Migrasi agenda selesai!');
    
    // Migrasi Galeri
    console.log('Memulai migrasi galeri...');
    const galeri = await GaleriMongo.find({});
    const galeriPromises = galeri.map(async (item) => {
      const galeriData = {
        judul: item.judul,
        deskripsi: item.deskripsi || '',
        kategori: item.kategori || 'umum',
        gambarUtama: item.gambarUtama || '',
        gambarTambahan: item.gambarTambahan || [],
        tanggal: item.tanggal || new Date(),
        status: item.status || 'draft',
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      };
      
      await db.collection('galeri').add(galeriData);
      console.log(`Galeri ${galeriData.judul} berhasil dimigrasi`);
    });
    
    await Promise.all(galeriPromises);
    console.log('Migrasi galeri selesai!');
    
    console.log('Semua data berhasil dimigrasi ke Firebase!');
    process.exit(0);
  } catch (error) {
    console.error('Error saat migrasi data:', error);
    process.exit(1);
  }
}

// Jalankan migrasi
migrateData();