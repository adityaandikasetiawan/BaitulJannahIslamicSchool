const db = require('../config/database');

class Galeri {
  static async findById(id) {
    try {
      const [galeri] = await db.query(
        'SELECT g.*, u.name as uploader_name FROM galeri g LEFT JOIN users u ON g.uploaded_by = u.id WHERE g.id = ?',
        [id]
      );
      return galeri;
    } catch (error) {
      throw error;
    }
  }

  static async create(galeriData) {
    try {
      const result = await db.query(
        'INSERT INTO galeri (judul, deskripsi, gambar, kategori, tanggal, uploaded_by, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          galeriData.judul,
          galeriData.deskripsi || '',
          galeriData.gambar,
          galeriData.kategori || 'Kegiatan Sekolah',
          galeriData.tanggal || new Date(),
          galeriData.uploadedBy,
          galeriData.isPublished !== undefined ? galeriData.isPublished : true
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, galeriData) {
    try {
      const result = await db.query(
        'UPDATE galeri SET judul = ?, deskripsi = ?, gambar = ?, kategori = ?, tanggal = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          galeriData.judul,
          galeriData.deskripsi || '',
          galeriData.gambar,
          galeriData.kategori || 'Kegiatan Sekolah',
          galeriData.tanggal || new Date(),
          galeriData.isPublished !== undefined ? galeriData.isPublished : true,
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
      const result = await db.query('DELETE FROM galeri WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async list(limit = 10, offset = 0) {
    try {
      const galeris = await db.query(
        'SELECT g.*, u.name as uploader_name FROM galeri g LEFT JOIN users u ON g.uploaded_by = u.id ORDER BY g.created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return galeris;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [result] = await db.query('SELECT COUNT(*) as total FROM galeri');
      return result.total;
    } catch (error) {
      throw error;
    }
  }

  static async findByKategori(kategori, limit = 10) {
    try {
      const galeris = await db.query(
        'SELECT g.*, u.name as uploader_name FROM galeri g LEFT JOIN users u ON g.uploaded_by = u.id WHERE g.kategori = ? AND g.is_published = true ORDER BY g.created_at DESC LIMIT ?',
        [kategori, limit]
      );
      return galeris;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Galeri;