const mongoose = require('mongoose');

const BeritaSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  isi: {
    type: String,
    required: true
  },
  gambar: {
    type: String,
    required: true
  },
  penulis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kategori: {
    type: String,
    enum: ['Akademik', 'Kegiatan', 'Pengumuman', 'Lainnya'],
    default: 'Lainnya'
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
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
BeritaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Berita = mongoose.model('Berita', BeritaSchema);

module.exports = Berita;