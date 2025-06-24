const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  deskripsi: {
    type: String,
    required: true
  },
  tanggal: {
    type: Date,
    required: true
  },
  waktuMulai: {
    type: String,
    required: true
  },
  waktuSelesai: {
    type: String,
    required: true
  },
  lokasi: {
    type: String,
    required: true
  },
  penyelenggara: {
    type: String,
    required: true
  },
  gambar: {
    type: String
  },
  kategori: {
    type: String,
    enum: ['Akademik', 'Keagamaan', 'Ekstrakurikuler', 'Rapat', 'Lainnya'],
    default: 'Lainnya'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'canceled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
AgendaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;