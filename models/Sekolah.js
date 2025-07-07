const db = require('../config/database');

class Sekolah {
  static async findById(id) {
    try {
      const [sekolah] = await db.query('SELECT * FROM sekolah WHERE id = ?', [id]);
      return sekolah[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByJenjang(jenjang) {
    try {
      const [sekolah] = await db.query('SELECT * FROM sekolah WHERE jenjang = ?', [jenjang]);
      return sekolah[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [sekolah] = await db.query('SELECT * FROM sekolah ORDER BY jenjang ASC');
      return sekolah;
    } catch (error) {
      throw error;
    }
  }

  static async create(sekolahData) {
    try {
      const result = await db.query(
        'INSERT INTO sekolah (jenjang, nama, visi, misi, tujuan, sejarah, kepala_sekolah, alamat, telepon, email, website, logo, gambar_utama, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          sekolahData.jenjang,
          sekolahData.nama,
          sekolahData.visi,
          sekolahData.misi,
          sekolahData.tujuan,
          sekolahData.sejarah || null,
          sekolahData.kepala_sekolah || null,
          sekolahData.alamat || null,
          sekolahData.telepon || null,
          sekolahData.email || null,
          sekolahData.website || null,
          sekolahData.logo || null,
          sekolahData.gambar_utama || null,
          sekolahData.status || 'aktif',
          sekolahData.created_by
        ]
      );
      return result[0].insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, sekolahData) {
    try {
      const result = await db.query(
        'UPDATE sekolah SET jenjang = ?, nama = ?, visi = ?, misi = ?, tujuan = ?, sejarah = ?, kepala_sekolah = ?, alamat = ?, telepon = ?, email = ?, website = ?, logo = ?, gambar_utama = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          sekolahData.jenjang,
          sekolahData.nama,
          sekolahData.visi,
          sekolahData.misi,
          sekolahData.tujuan,
          sekolahData.sejarah || null,
          sekolahData.kepala_sekolah || null,
          sekolahData.alamat || null,
          sekolahData.telepon || null,
          sekolahData.email || null,
          sekolahData.website || null,
          sekolahData.logo || null,
          sekolahData.gambar_utama || null,
          sekolahData.status || 'aktif',
          id
        ]
      );
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateByJenjang(jenjang, sekolahData) {
    try {
      const result = await db.query(
        'UPDATE sekolah SET nama = ?, visi = ?, misi = ?, tujuan = ?, sejarah = ?, kepala_sekolah = ?, alamat = ?, telepon = ?, email = ?, website = ?, logo = ?, gambar_utama = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE jenjang = ?',
        [
          sekolahData.nama,
          sekolahData.visi,
          sekolahData.misi,
          sekolahData.tujuan,
          sekolahData.sejarah || null,
          sekolahData.kepala_sekolah || null,
          sekolahData.alamat || null,
          sekolahData.telepon || null,
          sekolahData.email || null,
          sekolahData.website || null,
          sekolahData.logo || null,
          sekolahData.gambar_utama || null,
          sekolahData.status || 'aktif',
          jenjang
        ]
      );
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM sekolah WHERE id = ?', [id]);
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [result] = await db.query('SELECT COUNT(*) as count FROM sekolah');
      return result[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Sekolah;