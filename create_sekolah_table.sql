CREATE TABLE IF NOT EXISTS sekolah (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jenjang VARCHAR(50) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  visi TEXT,
  misi TEXT,
  tujuan TEXT,
  sejarah TEXT,
  kepala_sekolah VARCHAR(255),
  alamat TEXT,
  telepon VARCHAR(50),
  email VARCHAR(100),
  website VARCHAR(255),
  logo VARCHAR(255),
  gambar_utama VARCHAR(255),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  UNIQUE KEY (jenjang)
);

-- Insert default data for PGIT-TKIT
INSERT INTO sekolah (jenjang, nama, visi, misi, tujuan, status)
VALUES ('PGIT-TKIT', 'PGIT-TKIT Baitul Jannah Islamic School', 'Visi PGIT-TKIT', 'Misi PGIT-TKIT', 'Tujuan PGIT-TKIT', 'aktif');