const db = require('../config/database');

class SyaratPendaftaran {
  static async findById(id) {
    try {
      const [syarat] = await db.query('SELECT * FROM syarat_pendaftaran WHERE id = ?', [id]);
      return syarat[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [syarat] = await db.query('SELECT * FROM syarat_pendaftaran ORDER BY jenjang ASC');
      return syarat;
    } catch (error) {
      throw error;
    }
  }

  static async findByJenjang(jenjang) {
    try {
      const [syarat] = await db.query('SELECT * FROM syarat_pendaftaran WHERE jenjang = ?', [jenjang]);
      return syarat[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(syaratData) {
    try {
      const result = await db.query(
        `INSERT INTO syarat_pendaftaran (
          jenjang, persyaratan_umum, tahapan_seleksi, biaya_pendaftaran, informasi_tambahan
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          syaratData.jenjang,
          syaratData.persyaratan_umum,
          syaratData.tahapan_seleksi,
          syaratData.biaya_pendaftaran,
          syaratData.informasi_tambahan
        ]
      );
      return result[0].insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, syaratData) {
    try {
      const result = await db.query(
        `UPDATE syarat_pendaftaran SET 
          jenjang = ?, persyaratan_umum = ?, tahapan_seleksi = ?, 
          biaya_pendaftaran = ?, informasi_tambahan = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [
          syaratData.jenjang,
          syaratData.persyaratan_umum,
          syaratData.tahapan_seleksi,
          syaratData.biaya_pendaftaran,
          syaratData.informasi_tambahan,
          id
        ]
      );
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM syarat_pendaftaran WHERE id = ?', [id]);
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SyaratPendaftaran;