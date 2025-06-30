const db = require('../config/database');

class Informasi {
  static async findById(id) {
    try {
      const [informasi] = await db.query('SELECT * FROM informasi WHERE id = ?', [id]);
      return informasi;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [informasi] = await db.query('SELECT * FROM informasi ORDER BY created_at DESC');
      return informasi;
    } catch (error) {
      throw error;
    }
  }

  static async create(informasiData) {
    try {
      const result = await db.query(
        'INSERT INTO informasi (judul, konten, jenis, gambar, dokumen, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          informasiData.judul,
          informasiData.konten,
          informasiData.jenis || 'umum',
          informasiData.gambar || null,
          informasiData.dokumen || null,
          informasiData.status || 'aktif',
          informasiData.created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, informasiData) {
    try {
      const result = await db.query(
        'UPDATE informasi SET judul = ?, konten = ?, jenis = ?, gambar = ?, dokumen = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          informasiData.judul,
          informasiData.konten,
          informasiData.jenis || 'umum',
          informasiData.gambar || null,
          informasiData.dokumen || null,
          informasiData.status || 'aktif',
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
      const result = await db.query('DELETE FROM informasi WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByJenis(jenis) {
    try {
      const [informasi] = await db.query('SELECT * FROM informasi WHERE jenis = ? ORDER BY created_at DESC', [jenis]);
      return informasi;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Informasi;