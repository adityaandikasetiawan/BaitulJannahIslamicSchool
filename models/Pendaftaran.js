const db = require('../config/database');

class Pendaftaran {
  static async findById(id) {
    try {
      const [pendaftaran] = await db.query('SELECT * FROM pendaftaran WHERE id = ?', [id]);
      return pendaftaran[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [pendaftaran] = await db.query('SELECT * FROM pendaftaran ORDER BY created_at DESC');
      return pendaftaran;
    } catch (error) {
      throw error;
    }
  }

  static async create(pendaftaranData) {
    try {
      const result = await db.query(
        `INSERT INTO pendaftaran (
          nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, nik, agama, alamat, 
          nomor_telepon, email, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, 
          telepon_ortu, nomor_telepon_ayah, nomor_telepon_ibu, nama_wali, hubungan_wali,
          jenjang, asal_sekolah, tahun_lulus, prestasi, pas_foto, akta_kelahiran, kartu_keluarga, 
          rapor, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pendaftaranData.nama_lengkap,
          pendaftaranData.jenis_kelamin,
          pendaftaranData.tempat_lahir,
          pendaftaranData.tanggal_lahir,
          pendaftaranData.nik,
          pendaftaranData.agama,
          pendaftaranData.alamat,
          pendaftaranData.nomor_telepon,
          pendaftaranData.email,
          pendaftaranData.nama_ayah,
          pendaftaranData.pekerjaan_ayah,
          pendaftaranData.nama_ibu,
          pendaftaranData.pekerjaan_ibu,
          pendaftaranData.telepon_ortu || pendaftaranData.nomor_telepon_ayah,
          pendaftaranData.nomor_telepon_ayah,
          pendaftaranData.nomor_telepon_ibu,
          pendaftaranData.nama_wali,
          pendaftaranData.hubungan_wali,
          pendaftaranData.jenjang,
          pendaftaranData.asal_sekolah,
          pendaftaranData.tahun_lulus,
          pendaftaranData.prestasi,
          pendaftaranData.pas_foto,
          pendaftaranData.akta_kelahiran,
          pendaftaranData.kartu_keluarga,
          pendaftaranData.rapor,
          pendaftaranData.status || 'pending'
        ]
      );
      return result[0].insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, pendaftaranData) {
    try {
      const result = await db.query(
        `UPDATE pendaftaran SET 
          nama_lengkap = ?, jenis_kelamin = ?, tempat_lahir = ?, tanggal_lahir = ?, 
          nik = ?, agama = ?, alamat = ?, nomor_telepon = ?, email = ?, 
          nama_ayah = ?, pekerjaan_ayah = ?, nama_ibu = ?, pekerjaan_ibu = ?, 
          telepon_ortu = ?, nomor_telepon_ayah = ?, nomor_telepon_ibu = ?, 
          nama_wali = ?, hubungan_wali = ?, jenjang = ?, asal_sekolah = ?, 
          tahun_lulus = ?, prestasi = ?, pas_foto = ?, akta_kelahiran = ?, 
          kartu_keluarga = ?, rapor = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [
          pendaftaranData.nama_lengkap,
          pendaftaranData.jenis_kelamin,
          pendaftaranData.tempat_lahir,
          pendaftaranData.tanggal_lahir,
          pendaftaranData.nik,
          pendaftaranData.agama,
          pendaftaranData.alamat,
          pendaftaranData.nomor_telepon,
          pendaftaranData.email,
          pendaftaranData.nama_ayah,
          pendaftaranData.pekerjaan_ayah,
          pendaftaranData.nama_ibu,
          pendaftaranData.pekerjaan_ibu,
          pendaftaranData.telepon_ortu || pendaftaranData.nomor_telepon_ayah,
          pendaftaranData.nomor_telepon_ayah,
          pendaftaranData.nomor_telepon_ibu,
          pendaftaranData.nama_wali,
          pendaftaranData.hubungan_wali,
          pendaftaranData.jenjang,
          pendaftaranData.asal_sekolah,
          pendaftaranData.tahun_lulus,
          pendaftaranData.prestasi,
          pendaftaranData.pas_foto || null,
          pendaftaranData.akta_kelahiran || null,
          pendaftaranData.kartu_keluarga || null,
          pendaftaranData.rapor || null,
          pendaftaranData.status || 'pending',
          id
        ]
      );
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const result = await db.query(
        'UPDATE pendaftaran SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM pendaftaran WHERE id = ?', [id]);
      return result[0].affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByStatus(status) {
    try {
      const [pendaftaran] = await db.query('SELECT * FROM pendaftaran WHERE status = ? ORDER BY created_at DESC', [status]);
      return pendaftaran;
    } catch (error) {
      throw error;
    }
  }

  static async findByJenjang(jenjang) {
    try {
      const [pendaftaran] = await db.query('SELECT * FROM pendaftaran WHERE jenjang = ? ORDER BY created_at DESC', [jenjang]);
      return pendaftaran;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pendaftaran;