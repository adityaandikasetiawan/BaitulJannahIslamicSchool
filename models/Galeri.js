const mongoose = require('mongoose');

const GaleriSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  deskripsi: {
    type: String
  },
  gambar: {
    type: String,
    required: true
  },
  kategori: {
    type: String,
    enum: ['Kegiatan Sekolah', 'Prestasi', 'Fasilitas', 'Lainnya'],
    default: 'Kegiatan Sekolah'
  },
  tanggal: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
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
GaleriSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Galeri = mongoose.model('Galeri', GaleriSchema);

module.exports = Galeri;