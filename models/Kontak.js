const db = require('../config/database');

class Kontak {
    static async create(data) {
        const { nama, email, telepon, pesan, jenis, status = 'pending' } = data;
        const query = `
            INSERT INTO kontak 
            (nama, email, telepon, pesan, jenis, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.execute(query, [nama, email, telepon, pesan, jenis, status]);
        return result.insertId;
    }

    static async findAll() {
        const query = 'SELECT * FROM kontak ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM kontak WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async findByJenis(jenis) {
        const query = 'SELECT * FROM kontak WHERE jenis = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(query, [jenis]);
        return rows;
    }

    static async update(id, data) {
        const { status, catatan } = data;
        const query = `
            UPDATE kontak 
            SET status = ?, catatan = ?, updated_at = NOW() 
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [status, catatan, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM kontak WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Kontak;