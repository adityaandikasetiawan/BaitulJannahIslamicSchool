const { db } = require('../config/firebase');

class Berita {
  static async findOne(query) {
    try {
      const beritaRef = db.collection('berita');
      let beritaQuery = beritaRef;
      
      // Handle query parameters
      if (query.id) {
        const doc = await beritaRef.doc(query.id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        data.id = doc.id;
        return data;
      }
      
      if (query.judul) {
        beritaQuery = beritaQuery.where('judul', '==', query.judul);
      }
      
      const snapshot = await beritaQuery.limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const beritaData = snapshot.docs[0].data();
      beritaData.id = snapshot.docs[0].id;
      return beritaData;
    } catch (error) {
      console.error('Error finding berita:', error);
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const beritaDoc = await db.collection('berita').doc(id).get();
      
      if (!beritaDoc.exists) {
        return null;
      }
      
      const beritaData = beritaDoc.data();
      beritaData.id = beritaDoc.id;
      return beritaData;
    } catch (error) {
      console.error('Error finding berita by ID:', error);
      throw error;
    }
  }

  static async find(query = {}) {
    try {
      const beritaRef = db.collection('berita');
      let beritaQuery = beritaRef;
      
      // Add query filters if provided
      if (query.kategori) {
        beritaQuery = beritaQuery.where('kategori', '==', query.kategori);
      }
      
      if (query.status) {
        beritaQuery = beritaQuery.where('status', '==', query.status);
      }
      
      // Add sorting if provided
      let snapshot;
      if (query.sort) {
        const [field, order] = Object.entries(query.sort)[0];
        snapshot = await beritaQuery.orderBy(field, order === 1 ? 'asc' : 'desc').get();
      } else {
        // Default sort by createdAt descending
        snapshot = await beritaQuery.orderBy('createdAt', 'desc').get();
      }
      
      // Add pagination if provided
      if (query.limit) {
        beritaQuery = beritaQuery.limit(query.limit);
      }
      
      if (query.skip) {
        // Firestore doesn't have skip, so we need to use startAfter
        // This is a simplified implementation
        const skipSnapshot = await beritaQuery.limit(query.skip).get();
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          beritaQuery = beritaQuery.startAfter(lastDoc);
        }
      }
      
      if (!snapshot) {
        snapshot = await beritaQuery.get();
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
      console.error('Error finding berita:', error);
      throw error;
    }
  }

  static async countDocuments(query = {}) {
    try {
      const beritaRef = db.collection('berita');
      let beritaQuery = beritaRef;
      
      // Add query filters if provided
      if (query.kategori) {
        beritaQuery = beritaQuery.where('kategori', '==', query.kategori);
      }
      
      if (query.status) {
        beritaQuery = beritaQuery.where('status', '==', query.status);
      }
      
      const snapshot = await beritaQuery.get();
      return snapshot.size;
    } catch (error) {
      console.error('Error counting berita:', error);
      throw error;
    }
  }
  
  static async save(beritaData) {
    try {
      // Add timestamps
      const now = new Date();
      if (!beritaData.id) {
        beritaData.createdAt = now;
      }
      beritaData.updatedAt = now;
      
      let beritaRef;
      
      if (beritaData.id) {
        // Update existing berita
        beritaRef = db.collection('berita').doc(beritaData.id);
        const { id, ...dataToUpdate } = beritaData;
        await beritaRef.update(dataToUpdate);
        return { id, ...dataToUpdate };
      } else {
        // Create new berita
        const docRef = await db.collection('berita').add(beritaData);
        return { id: docRef.id, ...beritaData };
      }
    } catch (error) {
      console.error('Error saving berita:', error);
      throw error;
    }
  }

  static async deleteOne(query) {
    try {
      if (query.id) {
        await db.collection('berita').doc(query.id).delete();
        return { deletedCount: 1 };
      } else if (query.judul) {
        const berita = await this.findOne({ judul: query.judul });
        if (berita) {
          await db.collection('berita').doc(berita.id).delete();
          return { deletedCount: 1 };
        }
      }
      return { deletedCount: 0 };
    } catch (error) {
      console.error('Error deleting berita:', error);
      throw error;
    }
  }
}

module.exports = Berita;