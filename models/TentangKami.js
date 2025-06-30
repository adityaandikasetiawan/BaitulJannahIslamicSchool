const db = require('../config/database');

class TentangKami {
  static async findById(id) {
    try {
      const [tentangKami] = await db.query('SELECT * FROM tentang_kami WHERE id = ?', [id]);
      return tentangKami;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [tentangKami] = await db.query('SELECT * FROM tentang_kami ORDER BY created_at DESC');
      return tentangKami;
    } catch (error) {
      throw error;
    }
  }

  static async create(tentangKamiData) {
    try {
      const result = await db.query(
        'INSERT INTO tentang_kami (judul, konten, jenis, gambar, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [
          tentangKamiData.judul,
          tentangKamiData.konten,
          tentangKamiData.jenis || 'visimisi',
          tentangKamiData.gambar || null,
          tentangKamiData.status || 'aktif',
          tentangKamiData.created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, tentangKamiData) {
    try {
      const result = await db.query(
        'UPDATE tentang_kami SET judul = ?, konten = ?, jenis = ?, gambar = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          tentangKamiData.judul,
          tentangKamiData.konten,
          tentangKamiData.jenis || 'visimisi',
          tentangKamiData.gambar || null,
          tentangKamiData.status || 'aktif',
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
      const result = await db.query('DELETE FROM tentang_kami WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByJenis(jenis) {
    try {
      const [tentangKami] = await db.query('SELECT * FROM tentang_kami WHERE jenis = ? ORDER BY created_at DESC', [jenis]);
      return tentangKami;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TentangKami;