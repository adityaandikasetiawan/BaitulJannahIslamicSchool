const db = require('../config/database');

class Pengumuman {
  static async findById(id) {
    try {
      const [pengumuman] = await db.query(
        'SELECT p.*, u.name as penulis_name FROM pengumuman p LEFT JOIN users u ON p.penulis_id = u.id WHERE p.id = ?',
        [id]
      );
      return pengumuman;
    } catch (error) {
      throw error;
    }
  }

  static async create(pengumumanData) {
    try {
      const result = await db.query(
        'INSERT INTO pengumuman (judul, isi, tanggal_mulai, tanggal_selesai, penting, target, lampiran, penulis_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          pengumumanData.judul,
          pengumumanData.isi,
          pengumumanData.tanggalMulai,
          pengumumanData.tanggalSelesai,
          pengumumanData.penting || false,
          pengumumanData.target || 'Semua',
          pengumumanData.lampiran || null,
          pengumumanData.penulis_id,
          pengumumanData.status || 'published'
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, pengumumanData) {
    try {
      const result = await db.query(
        'UPDATE pengumuman SET judul = ?, isi = ?, tanggal_mulai = ?, tanggal_selesai = ?, penting = ?, target = ?, lampiran = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          pengumumanData.judul,
          pengumumanData.isi,
          pengumumanData.tanggalMulai,
          pengumumanData.tanggalSelesai,
          pengumumanData.penting || false,
          pengumumanData.target || 'Semua',
          pengumumanData.lampiran || null,
          pengumumanData.status || 'published',
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
      const result = await db.query('DELETE FROM pengumuman WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async list(limit = 10, offset = 0) {
    try {
      const pengumumans = await db.query(
        'SELECT p.*, u.name as penulis_name FROM pengumuman p LEFT JOIN users u ON p.penulis_id = u.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return pengumumans;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [result] = await db.query('SELECT COUNT(*) as total FROM pengumuman');
      return result.total;
    } catch (error) {
      throw error;
    }
  }

  static async findActive() {
    try {
      const pengumumans = await db.query(
        'SELECT p.*, u.name as penulis_name FROM pengumuman p LEFT JOIN users u ON p.penulis_id = u.id WHERE p.status = "published" AND p.tanggal_selesai >= CURDATE() ORDER BY p.penting DESC, p.created_at DESC'
      );
      return pengumumans;
    } catch (error) {
      throw error;
    }
  }

  static async findByTarget(target) {
    try {
      const pengumumans = await db.query(
        'SELECT p.*, u.name as penulis_name FROM pengumuman p LEFT JOIN users u ON p.penulis_id = u.id WHERE (p.target = ? OR p.target = "Semua") AND p.status = "published" AND p.tanggal_selesai >= CURDATE() ORDER BY p.penting DESC, p.created_at DESC',
        [target]
      );
      return pengumumans;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pengumuman;