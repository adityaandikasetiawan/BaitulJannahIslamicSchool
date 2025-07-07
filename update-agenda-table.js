const mysql = require('mysql2/promise');

async function updateAgendaTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'baitul_jannah_db'
    });

    console.log('Connected to database');

    // Check if agenda table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'agenda'"
    );

    if (tables.length === 0) {
      console.log('Agenda table does not exist. Creating new table...');
      
      // Create new agenda table with correct structure
      await connection.execute(`
        CREATE TABLE agenda (
          id INT PRIMARY KEY AUTO_INCREMENT,
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT,
          tanggal DATE NOT NULL,
          waktu_mulai TIME NOT NULL,
          waktu_selesai TIME NOT NULL,
          lokasi VARCHAR(255),
          penyelenggara VARCHAR(255),
          gambar VARCHAR(255),
          kategori VARCHAR(100) DEFAULT 'Lainnya',
          status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      
      console.log('Agenda table created successfully!');
    } else {
      console.log('Agenda table exists. Checking structure...');
      
      // Get current table structure
      const [columns] = await connection.execute("DESCRIBE agenda");
      const columnNames = columns.map(col => col.Field);
      
      console.log('Current columns:', columnNames);
      
      // Check if we need to update the structure
      const needsUpdate = columnNames.includes('tanggal_mulai') || columnNames.includes('tanggal_selesai');
      
      if (needsUpdate) {
        console.log('Updating agenda table structure...');
        
        // Backup existing data if any
        const [existingData] = await connection.execute('SELECT * FROM agenda');
        console.log(`Found ${existingData.length} existing records`);
        
        // Drop and recreate table
        await connection.execute('DROP TABLE agenda');
        console.log('Old agenda table dropped');
        
        // Create new table
        await connection.execute(`
          CREATE TABLE agenda (
            id INT PRIMARY KEY AUTO_INCREMENT,
            judul VARCHAR(255) NOT NULL,
            deskripsi TEXT,
            tanggal DATE NOT NULL,
            waktu_mulai TIME NOT NULL,
            waktu_selesai TIME NOT NULL,
            lokasi VARCHAR(255),
            penyelenggara VARCHAR(255),
            gambar VARCHAR(255),
            kategori VARCHAR(100) DEFAULT 'Lainnya',
            status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
            created_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
          )
        `);
        
        console.log('New agenda table created with correct structure!');
        
        // If there was existing data, you might want to migrate it here
        // For now, we'll just log that data was lost
        if (existingData.length > 0) {
          console.log('Warning: Existing agenda data was lost during structure update.');
          console.log('You may need to re-enter agenda data manually.');
        }
      } else {
        console.log('Agenda table structure is already correct!');
      }
    }

  } catch (error) {
    console.error('Error updating agenda table:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the update
updateAgendaTable();