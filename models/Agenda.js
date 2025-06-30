const db = require('../config/database');

class Agenda {
  static async findById(id) {
    try {
      const [agenda] = await db.query('SELECT * FROM agenda WHERE id = ?', [id]);
      return agenda;
    } catch (error) {
      throw error;
    }
  }

  static async create(agendaData) {
    try {
      const result = await db.query(
        'INSERT INTO agenda (judul, deskripsi, tanggal, waktu_mulai, waktu_selesai, lokasi, penyelenggara, gambar, kategori, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          agendaData.judul,
          agendaData.deskripsi,
          agendaData.tanggal,
          agendaData.waktuMulai,
          agendaData.waktuSelesai,
          agendaData.lokasi,
          agendaData.penyelenggara,
          agendaData.gambar || null,
          agendaData.kategori || 'Lainnya',
          agendaData.status || 'upcoming',
          agendaData.createdBy
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, agendaData) {
    try {
      const result = await db.query(
        'UPDATE agenda SET judul = ?, deskripsi = ?, tanggal = ?, waktu_mulai = ?, waktu_selesai = ?, lokasi = ?, penyelenggara = ?, gambar = ?, kategori = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          agendaData.judul,
          agendaData.deskripsi,
          agendaData.tanggal,
          agendaData.waktuMulai,
          agendaData.waktuSelesai,
          agendaData.lokasi,
          agendaData.penyelenggara,
          agendaData.gambar || null,
          agendaData.kategori || 'Lainnya',
          agendaData.status || 'upcoming',
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
      const result = await db.query('DELETE FROM agenda WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async list(limit = 10, offset = 0) {
    try {
      const agendas = await db.query(
        'SELECT a.*, u.name as creator_name FROM agenda a LEFT JOIN users u ON a.created_by = u.id ORDER BY a.tanggal DESC, a.waktu_mulai DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return agendas;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [result] = await db.query('SELECT COUNT(*) as total FROM agenda');
      return result.total;
    } catch (error) {
      throw error;
    }
  }

  static async findUpcoming(limit = 5) {
    try {
      const agendas = await db.query(
        'SELECT a.*, u.name as creator_name FROM agenda a LEFT JOIN users u ON a.created_by = u.id WHERE a.tanggal >= CURDATE() AND a.status = "upcoming" ORDER BY a.tanggal ASC, a.waktu_mulai ASC LIMIT ?',
        [limit]
      );
      return agendas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Agenda;