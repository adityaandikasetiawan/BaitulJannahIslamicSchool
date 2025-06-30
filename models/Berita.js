const db = require('../config/database');

class Berita {
  static async findById(id) {
    try {
      const [berita] = await db.query(
        'SELECT b.*, u.name as penulis_name FROM berita b LEFT JOIN users u ON b.penulis = u.id WHERE b.id = ?',
        [id]
      );
      return berita;
    } catch (error) {
      throw error;
    }
  }

  static async create(beritaData) {
    try {
      const result = await db.query(
        'INSERT INTO berita (judul, isi, gambar, penulis, kategori, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          beritaData.judul,
          beritaData.isi,
          beritaData.gambar,
          beritaData.penulis,
          beritaData.kategori || 'Lainnya',
          beritaData.status || 'draft'
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, beritaData) {
    try {
      const result = await db.query(
        'UPDATE berita SET judul = ?, isi = ?, gambar = ?, kategori = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          beritaData.judul,
          beritaData.isi,
          beritaData.gambar,
          beritaData.kategori || 'Lainnya',
          beritaData.status || 'draft',
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
      const result = await db.query('DELETE FROM berita WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async list(limit = 10, offset = 0) {
    try {
      const beritas = await db.query(
        'SELECT b.*, u.name as penulis_name FROM berita b LEFT JOIN users u ON b.penulis = u.id ORDER BY b.created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return beritas;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [result] = await db.query('SELECT COUNT(*) as total FROM berita');
      return result.total;
    } catch (error) {
      throw error;
    }
  }

  static async findByKategori(kategori, limit = 5) {
    try {
      const beritas = await db.query(
        'SELECT b.*, u.name as penulis_name FROM berita b LEFT JOIN users u ON b.penulis = u.id WHERE b.kategori = ? AND b.status = "published" ORDER BY b.created_at DESC LIMIT ?',
        [kategori, limit]
      );
      return beritas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Berita;