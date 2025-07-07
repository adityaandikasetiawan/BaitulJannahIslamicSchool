const mysql = require('mysql2/promise');

async function createTable() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'baitul_jannah_db'
    });

    console.log('Connected to database');

    // Create sekolah table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sekolah (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jenjang VARCHAR(50) NOT NULL,
        nama VARCHAR(255) NOT NULL,
        visi TEXT,
        misi TEXT,
        tujuan TEXT,
        sejarah TEXT,
        kepala_sekolah VARCHAR(255),
        alamat TEXT,
        telepon VARCHAR(50),
        email VARCHAR(100),
        website VARCHAR(255),
        logo VARCHAR(255),
        gambar_utama VARCHAR(255),
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        UNIQUE KEY (jenjang)
      )
    `);
    console.log('Table sekolah created successfully');

    // Insert default data if not exists
    await connection.execute(`
      INSERT IGNORE INTO sekolah 
        (jenjang, nama, visi, misi, tujuan, status) 
      VALUES 
        ('PGIT-TKIT', 'PGIT-TKIT Baitul Jannah Islamic School', 'Visi PGIT-TKIT', 'Misi PGIT-TKIT', 'Tujuan PGIT-TKIT', 'aktif')
    `);
    console.log('Default data inserted successfully');

    await connection.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

createTable();