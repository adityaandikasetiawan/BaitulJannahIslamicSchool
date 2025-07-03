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

  static async updateProfile(userId, userData) {
    try {
      console.log('Updating user profile for ID:', userId);
      const { firstName, lastName, phone, bio, avatar } = userData;
      
      let query = 'UPDATE users SET ';
      const updateFields = [];
      const values = [];
      
      if (firstName) {
        updateFields.push('firstName = ?');
        values.push(firstName);
      }
      
      if (lastName) {
        updateFields.push('lastName = ?');
        values.push(lastName);
      }
      
      if (phone) {
        updateFields.push('phone = ?');
        values.push(phone);
      }
      
      if (bio) {
        updateFields.push('bio = ?');
        values.push(bio);
      }
      
      if (avatar) {
        updateFields.push('avatar = ?');
        values.push(avatar);
      }
      
      if (updateFields.length === 0) {
        return false; // No fields to update
      }
      
      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      values.push(userId);
      
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  static async findByEmail(email) {
    try {
      console.log('Finding user by email:', email);
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log('Query result:', rows.length > 0 ? 'User found' : 'User not found');
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async updatePassword(userId, newPassword) {
    try {
      console.log('Updating password for user ID:', userId);
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update the password in the database
      const [result] = await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}

module.exports = User;