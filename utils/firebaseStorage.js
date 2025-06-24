const { admin } = require('../config/firebase');
const path = require('path');
const fs = require('fs');

// Inisialisasi Firebase Storage
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

/**
 * Upload file ke Firebase Storage
 * @param {Object} file - File yang diupload (dari multer)
 * @param {String} folder - Folder tujuan di Firebase Storage
 * @returns {Promise<String>} URL publik dari file yang diupload
 */
async function uploadFile(file, folder = 'uploads') {
  try {
    if (!file) {
      throw new Error('File tidak ditemukan');
    }

    // Buat nama file yang unik
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalname}`;
    const destination = `${folder}/${fileName}`;

    // Upload file ke Firebase Storage
    await bucket.upload(file.path, {
      destination: destination,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname
        }
      }
    });

    // Hapus file lokal setelah upload
    fs.unlinkSync(file.path);

    // Dapatkan URL publik
    const fileRef = bucket.file(destination);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '01-01-2500' // URL jangka panjang
    });

    return url;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw error;
  }
}

/**
 * Upload multiple files ke Firebase Storage
 * @param {Array} files - Array file yang diupload (dari multer)
 * @param {String} folder - Folder tujuan di Firebase Storage
 * @returns {Promise<Array<String>>} Array URL publik dari file yang diupload
 */
async function uploadMultipleFiles(files, folder = 'uploads') {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map(file => uploadFile(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Firebase Storage:', error);
    throw error;
  }
}

/**
 * Hapus file dari Firebase Storage berdasarkan URL
 * @param {String} fileUrl - URL file yang akan dihapus
 * @returns {Promise<Boolean>} Status keberhasilan penghapusan
 */
async function deleteFile(fileUrl) {
  try {
    if (!fileUrl) {
      return false;
    }

    // Ekstrak path file dari URL
    const urlObj = new URL(fileUrl);
    const filePath = urlObj.pathname.split('/o/')[1];
    if (!filePath) {
      return false;
    }

    // Decode URI component
    const decodedPath = decodeURIComponent(filePath);
    
    // Hapus file
    await bucket.file(decodedPath).delete();
    return true;
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    return false;
  }
}

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile
};