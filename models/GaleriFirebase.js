const { db } = require('../config/firebase');

class Galeri {
  static async findOne(query) {
    try {
      const galeriRef = db.collection('galeri');
      let galeriQuery = galeriRef;
      
      // Handle query parameters
      if (query.id) {
        const doc = await galeriRef.doc(query.id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        data.id = doc.id;
        return data;
      }
      
      if (query.judul) {
        galeriQuery = galeriQuery.where('judul', '==', query.judul);
      }
      
      const snapshot = await galeriQuery.limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const galeriData = snapshot.docs[0].data();
      galeriData.id = snapshot.docs[0].id;
      return galeriData;
    } catch (error) {
      console.error('Error finding galeri:', error);
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const galeriDoc = await db.collection('galeri').doc(id).get();
      
      if (!galeriDoc.exists) {
        return null;
      }
      
      const galeriData = galeriDoc.data();
      galeriData.id = galeriDoc.id;
      return galeriData;
    } catch (error) {
      console.error('Error finding galeri by ID:', error);
      throw error;
    }
  }

  static async find(query = {}) {
    try {
      const galeriRef = db.collection('galeri');
      let galeriQuery = galeriRef;
      
      // Add query filters if provided
      if (query.kategori) {
        galeriQuery = galeriQuery.where('kategori', '==', query.kategori);
      }
      
      if (query.status) {
        galeriQuery = galeriQuery.where('status', '==', query.status);
      }
      
      // Add sorting if provided
      let snapshot;
      if (query.sort) {
        const [field, order] = Object.entries(query.sort)[0];
        snapshot = await galeriQuery.orderBy(field, order === 1 ? 'asc' : 'desc').get();
      } else {
        // Default sort by tanggal descending (newest first)
        snapshot = await galeriQuery.orderBy('tanggal', 'desc').get();
      }
      
      // Add pagination if provided
      if (query.limit) {
        galeriQuery = galeriQuery.limit(query.limit);
      }
      
      if (query.skip) {
        // Firestore doesn't have skip, so we need to use startAfter
        // This is a simplified implementation
        const skipSnapshot = await galeriQuery.limit(query.skip).get();
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          galeriQuery = galeriQuery.startAfter(lastDoc);
        }
      }
      
      if (!snapshot) {
        snapshot = await galeriQuery.get();
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
      console.error('Error finding galeri:', error);
      throw error;
    }
  }

  static async countDocuments(query = {}) {
    try {
      const galeriRef = db.collection('galeri');
      let galeriQuery = galeriRef;
      
      // Add query filters if provided
      if (query.kategori) {
        galeriQuery = galeriQuery.where('kategori', '==', query.kategori);
      }
      
      if (query.status) {
        galeriQuery = galeriQuery.where('status', '==', query.status);
      }
      
      const snapshot = await galeriQuery.get();
      return snapshot.size;
    } catch (error) {
      console.error('Error counting galeri:', error);
      throw error;
    }
  }
  
  static async save(galeriData) {
    try {
      // Add timestamps
      const now = new Date();
      if (!galeriData.id) {
        galeriData.createdAt = now;
      }
      galeriData.updatedAt = now;
      
      // Convert date string to Date object if needed
      if (typeof galeriData.tanggal === 'string') {
        galeriData.tanggal = new Date(galeriData.tanggal);
      }
      
      let galeriRef;
      
      if (galeriData.id) {
        // Update existing galeri
        galeriRef = db.collection('galeri').doc(galeriData.id);
        const { id, ...dataToUpdate } = galeriData;
        await galeriRef.update(dataToUpdate);
        return { id, ...dataToUpdate };
      } else {
        // Create new galeri
        const docRef = await db.collection('galeri').add(galeriData);
        return { id: docRef.id, ...galeriData };
      }
    } catch (error) {
      console.error('Error saving galeri:', error);
      throw error;
    }
  }

  static async deleteOne(query) {
    try {
      if (query.id) {
        await db.collection('galeri').doc(query.id).delete();
        return { deletedCount: 1 };
      } else if (query.judul) {
        const galeri = await this.findOne({ judul: query.judul });
        if (galeri) {
          await db.collection('galeri').doc(galeri.id).delete();
          return { deletedCount: 1 };
        }
      }
      return { deletedCount: 0 };
    } catch (error) {
      console.error('Error deleting galeri:', error);
      throw error;
    }
  }
}

module.exports = Galeri;