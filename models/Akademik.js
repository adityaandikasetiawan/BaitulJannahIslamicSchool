const db = require('../config/database');

class Akademik {
  static async findById(id) {
    try {
      const [akademik] = await db.query('SELECT * FROM akademik WHERE id = ?', [id]);
      return akademik;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [akademik] = await db.query('SELECT * FROM akademik ORDER BY created_at DESC');
      return akademik;
    } catch (error) {
      throw error;
    }
  }

  static async create(akademikData) {
    try {
      const result = await db.query(
        'INSERT INTO akademik (judul, deskripsi, jenis, gambar, dokumen, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          akademikData.judul,
          akademikData.deskripsi,
          akademikData.jenis || 'umum',
          akademikData.gambar || null,
          akademikData.dokumen || null,
          akademikData.status || 'aktif',
          akademikData.created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, akademikData) {
    try {
      const result = await db.query(
        'UPDATE akademik SET judul = ?, deskripsi = ?, jenis = ?, gambar = ?, dokumen = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          akademikData.judul,
          akademikData.deskripsi,
          akademikData.jenis || 'umum',
          akademikData.gambar || null,
          akademikData.dokumen || null,
          akademikData.status || 'aktif',
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
      const result = await db.query('DELETE FROM akademik WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByJenis(jenis) {
    try {
      const [akademik] = await db.query('SELECT * FROM akademik WHERE jenis = ? ORDER BY created_at DESC', [jenis]);
      return akademik;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Akademik;