const { db } = require('../config/firebase');

class Pengumuman {
  static async findOne(query) {
    try {
      const pengumumanRef = db.collection('pengumuman');
      let pengumumanQuery = pengumumanRef;
      
      // Handle query parameters
      if (query.id) {
        const doc = await pengumumanRef.doc(query.id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        data.id = doc.id;
        return data;
      }
      
      if (query.judul) {
        pengumumanQuery = pengumumanQuery.where('judul', '==', query.judul);
      }
      
      const snapshot = await pengumumanQuery.limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const pengumumanData = snapshot.docs[0].data();
      pengumumanData.id = snapshot.docs[0].id;
      return pengumumanData;
    } catch (error) {
      console.error('Error finding pengumuman:', error);
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const pengumumanDoc = await db.collection('pengumuman').doc(id).get();
      
      if (!pengumumanDoc.exists) {
        return null;
      }
      
      const pengumumanData = pengumumanDoc.data();
      pengumumanData.id = pengumumanDoc.id;
      return pengumumanData;
    } catch (error) {
      console.error('Error finding pengumuman by ID:', error);
      throw error;
    }
  }

  static async find(query = {}) {
    try {
      const pengumumanRef = db.collection('pengumuman');
      let pengumumanQuery = pengumumanRef;
      
      // Add query filters if provided
      if (query.audiens) {
        pengumumanQuery = pengumumanQuery.where('audiens', '==', query.audiens);
      }
      
      if (query.status) {
        pengumumanQuery = pengumumanQuery.where('status', '==', query.status);
      }
      
      if (query.penting !== undefined) {
        pengumumanQuery = pengumumanQuery.where('penting', '==', query.penting);
      }
      
      // Add date range filter if provided
      const today = new Date();
      if (query.active) {
        pengumumanQuery = pengumumanQuery
          .where('tanggalMulai', '<=', today)
          .where('tanggalSelesai', '>=', today);
      }
      
      // Add sorting if provided
      let snapshot;
      if (query.sort) {
        const [field, order] = Object.entries(query.sort)[0];
        snapshot = await pengumumanQuery.orderBy(field, order === 1 ? 'asc' : 'desc').get();
      } else {
        // Default sort by penting (desc) and then tanggalMulai (desc)
        snapshot = await pengumumanQuery.orderBy('penting', 'desc').orderBy('tanggalMulai', 'desc').get();
      }
      
      // Add pagination if provided
      if (query.limit) {
        pengumumanQuery = pengumumanQuery.limit(query.limit);
      }
      
      if (query.skip) {
        // Firestore doesn't have skip, so we need to use startAfter
        // This is a simplified implementation
        const skipSnapshot = await pengumumanQuery.limit(query.skip).get();
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          pengumumanQuery = pengumumanQuery.startAfter(lastDoc);
        }
      }
      
      if (!snapshot) {
        snapshot = await pengumumanQuery.get();
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
      console.error('Error finding pengumuman:', error);
      throw error;
    }
  }

  static async countDocuments(query = {}) {
    try {
      const pengumumanRef = db.collection('pengumuman');
      let pengumumanQuery = pengumumanRef;
      
      // Add query filters if provided
      if (query.audiens) {
        pengumumanQuery = pengumumanQuery.where('audiens', '==', query.audiens);
      }
      
      if (query.status) {
        pengumumanQuery = pengumumanQuery.where('status', '==', query.status);
      }
      
      if (query.penting !== undefined) {
        pengumumanQuery = pengumumanQuery.where('penting', '==', query.penting);
      }
      
      const snapshot = await pengumumanQuery.get();
      return snapshot.size;
    } catch (error) {
      console.error('Error counting pengumuman:', error);
      throw error;
    }
  }
  
  static async save(pengumumanData) {
    try {
      // Add timestamps
      const now = new Date();
      if (!pengumumanData.id) {
        pengumumanData.createdAt = now;
      }
      pengumumanData.updatedAt = now;
      
      // Convert date strings to Date objects if needed
      if (typeof pengumumanData.tanggalMulai === 'string') {
        pengumumanData.tanggalMulai = new Date(pengumumanData.tanggalMulai);
      }
      
      if (typeof pengumumanData.tanggalSelesai === 'string') {
        pengumumanData.tanggalSelesai = new Date(pengumumanData.tanggalSelesai);
      }
      
      let pengumumanRef;
      
      if (pengumumanData.id) {
        // Update existing pengumuman
        pengumumanRef = db.collection('pengumuman').doc(pengumumanData.id);
        const { id, ...dataToUpdate } = pengumumanData;
        await pengumumanRef.update(dataToUpdate);
        return { id, ...dataToUpdate };
      } else {
        // Create new pengumuman
        const docRef = await db.collection('pengumuman').add(pengumumanData);
        return { id: docRef.id, ...pengumumanData };
      }
    } catch (error) {
      console.error('Error saving pengumuman:', error);
      throw error;
    }
  }

  static async deleteOne(query) {
    try {
      if (query.id) {
        await db.collection('pengumuman').doc(query.id).delete();
        return { deletedCount: 1 };
      } else if (query.judul) {
        const pengumuman = await this.findOne({ judul: query.judul });
        if (pengumuman) {
          await db.collection('pengumuman').doc(pengumuman.id).delete();
          return { deletedCount: 1 };
        }
      }
      return { deletedCount: 0 };
    } catch (error) {
      console.error('Error deleting pengumuman:', error);
      throw error;
    }
  }
}

module.exports = Pengumuman;