require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function updateUsersTable() {
  let connection;

  try {
    // Create connection to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'baitul_jannah_db'
    });

    console.log('Connected to MySQL database');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'config', 'update_users.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL script into individual statements
    const statements = sqlScript
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await connection.query(statement);
      console.log('Executed SQL statement successfully');
    }

    console.log('Users table updated successfully');
  } catch (error) {
    console.error('Error updating users table:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the function
updateUsersTable();