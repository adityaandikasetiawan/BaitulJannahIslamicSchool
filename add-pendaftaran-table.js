require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function addPendaftaranTable() {
  let connection;

  try {
    // Create connection with database selection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'baitul_jannah_db'
    });

    console.log(`Connected to database ${process.env.DB_NAME || 'baitul_jannah_db'}`);

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'config', 'add_pendaftaran.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL script
    await connection.query(sqlScript);
    console.log('Pendaftaran table created or already exists');

    console.log('Database update completed successfully');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

addPendaftaranTable();