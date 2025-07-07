const db = require('../config/database');

class Beranda {
  // Mendapatkan data carousel berdasarkan ID
  static async findCarouselById(id) {
    try {
      const [carousel] = await db.query(
        'SELECT * FROM beranda_carousel WHERE id = ?',
        [id]
      );
      return carousel;
    } catch (error) {
      throw error;
    }
  }

  // Mendapatkan semua data carousel
  static async getAllCarousel() {
    try {
      const carousels = await db.query(
        'SELECT * FROM beranda_carousel ORDER BY urutan ASC'
      );
      return carousels;
    } catch (error) {
      throw error;
    }
  }

  // Membuat data carousel baru
  static async createCarousel(carouselData) {
    try {
      const result = await db.query(
        'INSERT INTO beranda_carousel (judul, subjudul, deskripsi, gambar, urutan) VALUES (?, ?, ?, ?, ?)',
        [
          carouselData.judul,
          carouselData.subjudul,
          carouselData.deskripsi,
          carouselData.gambar,
          carouselData.urutan
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate data carousel
  static async updateCarousel(id, carouselData) {
    try {
      const result = await db.query(
        'UPDATE beranda_carousel SET judul = ?, subjudul = ?, deskripsi = ?, gambar = ?, urutan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          carouselData.judul,
          carouselData.subjudul,
          carouselData.deskripsi,
          carouselData.gambar,
          carouselData.urutan,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Menghapus data carousel
  static async deleteCarousel(id) {
    try {
      const result = await db.query('DELETE FROM beranda_carousel WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Mendapatkan pengaturan carousel
  static async getCarouselSettings() {
    try {
      const [settings] = await db.query('SELECT * FROM beranda_carousel_settings WHERE id = 1');
      if (settings) {
        return settings;
      }

      // If no settings found but table exists, insert default settings
      await db.query(
        'INSERT INTO beranda_carousel_settings (autoplay, `interval`, showIndicators, showControls) VALUES (TRUE, 5000, TRUE, TRUE)'
      );
      const [newSettings] = await db.query('SELECT * FROM beranda_carousel_settings WHERE id = 1');
      return newSettings;

    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        try {
          // Create table
          await db.query(
            `CREATE TABLE IF NOT EXISTS beranda_carousel_settings (
              id INT PRIMARY KEY AUTO_INCREMENT,
              autoplay BOOLEAN NOT NULL DEFAULT TRUE,
              \`interval\` INT NOT NULL DEFAULT 5000,
              showIndicators BOOLEAN NOT NULL DEFAULT TRUE,
              showControls BOOLEAN NOT NULL DEFAULT TRUE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`
          );
          
          // Insert default settings
          await db.query(
            'INSERT INTO beranda_carousel_settings (autoplay, `interval`, showIndicators, showControls) VALUES (TRUE, 5000, TRUE, TRUE)'
          );
          
          // Return newly inserted settings
          const [newSettings] = await db.query('SELECT * FROM beranda_carousel_settings WHERE id = 1');
          return newSettings;
        } catch (createError) {
          console.error('Error creating carousel settings table:', createError);
          // Return default settings if table creation fails
          return {
            id: 1,
            autoplay: true,
            interval: 5000,
            showIndicators: true,
            showControls: true
          };
        }
      }
      console.error('Get Carousel Settings Error:', error);
      // Return default settings for any other error
      return {
        id: 1,
        autoplay: true,
        interval: 5000,
        showIndicators: true,
        showControls: true
      };
    }
  }

  // Mengupdate pengaturan carousel
  static async updateCarouselSettings(settingsData) {
    try {
      // Cek apakah tabel sudah ada
      const tableExists = await db.query(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'beranda_carousel_settings'"
      );
      
      // Jika tabel belum ada, buat tabel baru
      if (tableExists[0].count === 0) {
        await db.query(
          `CREATE TABLE IF NOT EXISTS beranda_carousel_settings (
            id INT PRIMARY KEY AUTO_INCREMENT,
            autoplay BOOLEAN NOT NULL DEFAULT TRUE,
            interval INT NOT NULL DEFAULT 5000,
            showIndicators BOOLEAN NOT NULL DEFAULT TRUE,
            showControls BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )`
        );
        
        // Insert data awal
        await db.query(
          'INSERT INTO beranda_carousel_settings (autoplay, interval, showIndicators, showControls) VALUES (?, ?, ?, ?)',
          [settingsData.autoplay, settingsData.interval, settingsData.showIndicators, settingsData.showControls]
        );
        
        return true;
      }
      
      // Cek apakah ada data di tabel
      const [existingSettings] = await db.query('SELECT * FROM beranda_carousel_settings WHERE id = 1');
      
      if (existingSettings) {
        // Update data yang ada
        const result = await db.query(
          'UPDATE beranda_carousel_settings SET autoplay = ?, interval = ?, showIndicators = ?, showControls = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
          [settingsData.autoplay, settingsData.interval, settingsData.showIndicators, settingsData.showControls]
        );
        return result.affectedRows > 0;
      } else {
        // Insert data baru jika tidak ada
        const result = await db.query(
          'INSERT INTO beranda_carousel_settings (id, autoplay, interval, showIndicators, showControls) VALUES (1, ?, ?, ?, ?)',
          [settingsData.autoplay, settingsData.interval, settingsData.showIndicators, settingsData.showControls]
        );
        return result.insertId > 0;
      }
    } catch (error) {
      throw error;
    }
  }

  // Mendapatkan data visi berdasarkan ID
  static async findVisionById(id) {
    try {
      const [vision] = await db.query(
        'SELECT * FROM beranda_vision WHERE id = ?',
        [id]
      );
      return vision;
    } catch (error) {
      throw error;
    }
  }

  // Mendapatkan semua data visi
  static async getAllVision() {
    try {
      const visions = await db.query(
        'SELECT * FROM beranda_vision ORDER BY urutan ASC'
      );
      return visions;
    } catch (error) {
      throw error;
    }
  }

  // Membuat data visi baru
  static async createVision(visionData) {
    try {
      const result = await db.query(
        'INSERT INTO beranda_vision (judul, icon, link, urutan) VALUES (?, ?, ?, ?)',
        [
          visionData.judul,
          visionData.icon,
          visionData.link,
          visionData.urutan
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate data visi
  static async updateVision(id, visionData) {
    try {
      const result = await db.query(
        'UPDATE beranda_vision SET judul = ?, icon = ?, link = ?, urutan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          visionData.judul,
          visionData.icon,
          visionData.link,
          visionData.urutan,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Menghapus data visi
  static async deleteVision(id) {
    try {
      const result = await db.query('DELETE FROM beranda_vision WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Mendapatkan data about
  static async getAbout() {
    try {
      const [about] = await db.query('SELECT * FROM beranda_about LIMIT 1');
      return about;
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate data about
  static async updateAbout(aboutData) {
    try {
      // Cek apakah data sudah ada
      const [existing] = await db.query('SELECT id FROM beranda_about LIMIT 1');
      
      if (existing) {
        // Update data yang ada
        const result = await db.query(
          'UPDATE beranda_about SET judul = ?, subjudul = ?, deskripsi = ?, gambar1 = ?, gambar2 = ?, gambar3 = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [
            aboutData.judul,
            aboutData.subjudul,
            aboutData.deskripsi,
            aboutData.gambar1,
            aboutData.gambar2,
            aboutData.gambar3,
            existing.id
          ]
        );
        return result.affectedRows > 0;
      } else {
        // Buat data baru jika belum ada
        const result = await db.query(
          'INSERT INTO beranda_about (judul, subjudul, deskripsi, gambar1, gambar2, gambar3) VALUES (?, ?, ?, ?, ?, ?)',
          [
            aboutData.judul,
            aboutData.subjudul,
            aboutData.deskripsi,
            aboutData.gambar1,
            aboutData.gambar2,
            aboutData.gambar3
          ]
        );
        return result.insertId;
      }
    } catch (error) {
      throw error;
    }
  }

  // Mendapatkan data statistik
  static async getStats() {
    try {
      const stats = await db.query('SELECT * FROM beranda_stats ORDER BY id ASC');
      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate data statistik
  static async updateStats(id, statsData) {
    try {
      const result = await db.query(
        'UPDATE beranda_stats SET judul = ?, nilai = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          statsData.judul,
          statsData.nilai,
          statsData.icon,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Beranda;