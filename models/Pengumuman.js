const mongoose = require('mongoose');

const PengumumanSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  isi: {
    type: String,
    required: true
  },
  tanggalMulai: {
    type: Date,
    required: true
  },
  tanggalSelesai: {
    type: Date,
    required: true
  },
  penting: {
    type: Boolean,
    default: false
  },
  untuk: {
    type: String,
    enum: ['Semua', 'Siswa', 'Guru', 'Orang Tua', 'Staff'],
    default: 'Semua'
  },
  lampiran: {
    type: String
  },
  penulis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp sebelum menyimpan
PengumumanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Pengumuman = mongoose.model('Pengumuman', PengumumanSchema);

module.exports = Pengumuman;