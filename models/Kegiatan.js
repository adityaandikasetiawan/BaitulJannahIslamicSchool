const db = require('../config/database');

class Kegiatan {
  static async findById(id) {
    try {
      const [kegiatan] = await db.query('SELECT * FROM kegiatan WHERE id = ?', [id]);
      return kegiatan;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [kegiatan] = await db.query('SELECT * FROM kegiatan ORDER BY created_at DESC');
      return kegiatan;
    } catch (error) {
      throw error;
    }
  }

  static async create(kegiatanData) {
    try {
      const result = await db.query(
        'INSERT INTO kegiatan (judul, deskripsi, tanggal, waktu_mulai, waktu_selesai, lokasi, jenis, gambar, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          kegiatanData.judul,
          kegiatanData.deskripsi,
          kegiatanData.tanggal,
          kegiatanData.waktuMulai,
          kegiatanData.waktuSelesai,
          kegiatanData.lokasi,
          kegiatanData.jenis || 'umum',
          kegiatanData.gambar || null,
          kegiatanData.status || 'aktif',
          kegiatanData.created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, kegiatanData) {
    try {
      const result = await db.query(
        'UPDATE kegiatan SET judul = ?, deskripsi = ?, tanggal = ?, waktu_mulai = ?, waktu_selesai = ?, lokasi = ?, jenis = ?, gambar = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          kegiatanData.judul,
          kegiatanData.deskripsi,
          kegiatanData.tanggal,
          kegiatanData.waktuMulai,
          kegiatanData.waktuSelesai,
          kegiatanData.lokasi,
          kegiatanData.jenis || 'umum',
          kegiatanData.gambar || null,
          kegiatanData.status || 'aktif',
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM kegiatan WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByJenis(jenis) {
    try {
      const [kegiatan] = await db.query('SELECT * FROM kegiatan WHERE jenis = ? ORDER BY created_at DESC', [jenis]);
      return kegiatan;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Kegiatan;