const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
  static async findByUsername(username) {
    try {
      console.log('Finding user by username:', username);
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      console.log('Query result:', rows.length > 0 ? 'User found' : 'User not found');
      return rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  static async validatePassword(password, hashedPassword) {
    try {
      console.log('Validating password');
      const result = await bcrypt.compare(password, hashedPassword);
      console.log('Password validation result:', result ? 'Match' : 'Mismatch');
      return result;
    } catch (error) {
      console.error('Error validating password:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log('Finding user by id:', id);
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      console.log('Query result:', rows.length > 0 ? 'User found' : 'User not found');
      return rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }
}

module.exports = User;