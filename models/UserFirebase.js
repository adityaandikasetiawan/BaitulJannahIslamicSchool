const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

class User {
  static async findOne(query) {
    try {
      const usersRef = db.collection('users');
      let userQuery = usersRef;
      
      // Handle query parameters
      if (query.email) {
        userQuery = userQuery.where('email', '==', query.email);
      }
      
      const snapshot = await userQuery.limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const userData = snapshot.docs[0].data();
      userData.id = snapshot.docs[0].id;
      return userData;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const userDoc = await db.collection('users').doc(id).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      const userData = userDoc.data();
      userData.id = userDoc.id;
      return userData;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async find(query = {}) {
    try {
      const usersRef = db.collection('users');
      let userQuery = usersRef;
      
      // Add query filters if provided
      if (query.role) {
        userQuery = userQuery.where('role', '==', query.role);
      }
      
      // Add sorting if provided
      let snapshot;
      if (query.sort) {
        const [field, order] = Object.entries(query.sort)[0];
        snapshot = await userQuery.orderBy(field, order === 1 ? 'asc' : 'desc').get();
      } else {
        // Default sort by date descending
        snapshot = await userQuery.orderBy('date', 'desc').get();
      }
      
      if (snapshot.empty) {
        return [];
      }
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }

  static async countDocuments(query = {}) {
    try {
      const usersRef = db.collection('users');
      let userQuery = usersRef;
      
      // Add query filters if provided
      if (query.role) {
        userQuery = userQuery.where('role', '==', query.role);
      }
      
      const snapshot = await userQuery.get();
      return snapshot.size;
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }
  
  static async save(userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      
      // Add created date if new user
      if (!userData.id) {
        userData.date = new Date();
      }
      
      let userRef;
      
      if (userData.id) {
        // Update existing user
        userRef = db.collection('users').doc(userData.id);
        const { id, ...dataToUpdate } = userData;
        await userRef.update(dataToUpdate);
        return { id, ...dataToUpdate };
      } else {
        // Create new user
        const docRef = await db.collection('users').add(userData);
        return { id: docRef.id, ...userData };
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async deleteOne(query) {
    try {
      if (query.id) {
        await db.collection('users').doc(query.id).delete();
        return { deletedCount: 1 };
      } else if (query.email) {
        const user = await this.findOne({ email: query.email });
        if (user) {
          await db.collection('users').doc(user.id).delete();
          return { deletedCount: 1 };
        }
      }
      return { deletedCount: 0 };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;