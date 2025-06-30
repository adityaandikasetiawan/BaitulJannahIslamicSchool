require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;

  try {
    // Create connection without database selection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'baitul_jannah_db'}`);
    console.log(`Database ${process.env.DB_NAME || 'baitul_jannah_db'} created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'baitul_jannah_db'}`);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');

    // Check if admin user exists
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);

    // Insert default admin user if not exists
    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin', '$2a$10$N.XbGfZBvLQQfXjrQVjQZ.fR3KMo.Ful5o9Jjx1nCVhEOzxRwkRXC', 'Administrator', 'admin']
      );
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

setupDatabase();