const { db } = require('../config/firebase');

class Agenda {
  static async findOne(query) {
    try {
      const agendaRef = db.collection('agenda');
      let agendaQuery = agendaRef;
      
      // Handle query parameters
      if (query.id) {
        const doc = await agendaRef.doc(query.id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        data.id = doc.id;
        return data;
      }
      
      if (query.judul) {
        agendaQuery = agendaQuery.where('judul', '==', query.judul);
      }
      
      const snapshot = await agendaQuery.limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const agendaData = snapshot.docs[0].data();
      agendaData.id = snapshot.docs[0].id;
      return agendaData;
    } catch (error) {
      console.error('Error finding agenda:', error);
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const agendaDoc = await db.collection('agenda').doc(id).get();
      
      if (!agendaDoc.exists) {
        return null;
      }
      
      const agendaData = agendaDoc.data();
      agendaData.id = agendaDoc.id;
      return agendaData;
    } catch (error) {
      console.error('Error finding agenda by ID:', error);
      throw error;
    }
  }

  static async find(query = {}) {
    try {
      const agendaRef = db.collection('agenda');
      let agendaQuery = agendaRef;
      
      // Add query filters if provided
      if (query.kategori) {
        agendaQuery = agendaQuery.where('kategori', '==', query.kategori);
      }
      
      if (query.status) {
        agendaQuery = agendaQuery.where('status', '==', query.status);
      }
      
      if (query.lokasi) {
        agendaQuery = agendaQuery.where('lokasi', '==', query.lokasi);
      }
      
      // Add date range filter if provided
      const today = new Date();
      if (query.upcoming) {
        agendaQuery = agendaQuery.where('tanggal', '>=', today);
      }
      
      // Add sorting if provided
      let snapshot;
      if (query.sort) {
        const [field, order] = Object.entries(query.sort)[0];
        snapshot = await agendaQuery.orderBy(field, order === 1 ? 'asc' : 'desc').get();
      } else {
        // Default sort by tanggal ascending for upcoming events
        snapshot = await agendaQuery.orderBy('tanggal', 'asc').get();
      }
      
      // Add pagination if provided
      if (query.limit) {
        agendaQuery = agendaQuery.limit(query.limit);
      }
      
      if (query.skip) {
        // Firestore doesn't have skip, so we need to use startAfter
        // This is a simplified implementation
        const skipSnapshot = await agendaQuery.limit(query.skip).get();
        if (!skipSnapshot.empty) {
          const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
          agendaQuery = agendaQuery.startAfter(lastDoc);
        }
      }
      
      if (!snapshot) {
        snapshot = await agendaQuery.get();
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
      console.error('Error finding agenda:', error);
      throw error;
    }
  }

  static async countDocuments(query = {}) {
    try {
      const agendaRef = db.collection('agenda');
      let agendaQuery = agendaRef;
      
      // Add query filters if provided
      if (query.kategori) {
        agendaQuery = agendaQuery.where('kategori', '==', query.kategori);
      }
      
      if (query.status) {
        agendaQuery = agendaQuery.where('status', '==', query.status);
      }
      
      if (query.lokasi) {
        agendaQuery = agendaQuery.where('lokasi', '==', query.lokasi);
      }
      
      const snapshot = await agendaQuery.get();
      return snapshot.size;
    } catch (error) {
      console.error('Error counting agenda:', error);
      throw error;
    }
  }
  
  static async save(agendaData) {
    try {
      // Add timestamps
      const now = new Date();
      if (!agendaData.id) {
        agendaData.createdAt = now;
      }
      agendaData.updatedAt = now;
      
      // Convert date string to Date object if needed
      if (typeof agendaData.tanggal === 'string') {
        agendaData.tanggal = new Date(agendaData.tanggal);
      }
      
      let agendaRef;
      
      if (agendaData.id) {
        // Update existing agenda
        agendaRef = db.collection('agenda').doc(agendaData.id);
        const { id, ...dataToUpdate } = agendaData;
        await agendaRef.update(dataToUpdate);
        return { id, ...dataToUpdate };
      } else {
        // Create new agenda
        const docRef = await db.collection('agenda').add(agendaData);
        return { id: docRef.id, ...agendaData };
      }
    } catch (error) {
      console.error('Error saving agenda:', error);
      throw error;
    }
  }

  static async deleteOne(query) {
    try {
      if (query.id) {
        await db.collection('agenda').doc(query.id).delete();
        return { deletedCount: 1 };
      } else if (query.judul) {
        const agenda = await this.findOne({ judul: query.judul });
        if (agenda) {
          await db.collection('agenda').doc(agenda.id).delete();
          return { deletedCount: 1 };
        }
      }
      return { deletedCount: 0 };
    } catch (error) {
      console.error('Error deleting agenda:', error);
      throw error;
    }
  }
}

module.exports = Agenda;