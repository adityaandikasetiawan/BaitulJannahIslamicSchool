-- Tabel sekolah untuk menyimpan profil sekolah berdasarkan jenjang
CREATE TABLE IF NOT EXISTS sekolah (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jenjang ENUM('PGIT-TKIT', 'SDIT', 'SMPIT', 'SMAIT', 'SLBIT') NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  visi TEXT,
  misi TEXT,
  tujuan TEXT,
  sejarah TEXT,
  kepala_sekolah VARCHAR(255),
  alamat TEXT,
  telepon VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  logo VARCHAR(255),
  gambar_utama VARCHAR(255),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert data default untuk setiap jenjang
INSERT INTO sekolah (jenjang, nama, visi, misi, tujuan, created_by) VALUES
('PGIT-TKIT', 'PGIT-TKIT Baitul Jannah', 
 'Menjadi lembaga pendidikan anak usia dini yang unggul dalam membentuk generasi Qur\'ani yang berakhlak mulia, cerdas, dan mandiri.',
 'Menyelenggarakan pendidikan anak usia dini yang berkualitas dengan pendekatan Islami, mengembangkan potensi anak secara optimal, dan membangun karakter yang kuat berdasarkan nilai-nilai Al-Qur\'an dan As-Sunnah.',
 'Membentuk anak didik yang memiliki fondasi keimanan yang kuat, kecerdasan yang berkembang optimal, dan keterampilan hidup yang memadai untuk melanjutkan pendidikan ke jenjang yang lebih tinggi.',
 1),
('SDIT', 'SDIT Baitul Jannah',
 'Menjadi sekolah dasar Islam terpadu yang unggul dalam mencetak generasi Qur\'ani yang berakhlak mulia, berprestasi, dan berwawasan global.',
 'Menyelenggarakan pendidikan dasar Islam terpadu yang berkualitas, mengintegrasikan kurikulum nasional dengan nilai-nilai Islam, mengembangkan potensi akademik dan non-akademik siswa, serta membangun karakter Islami yang kuat.',
 'Menghasilkan lulusan yang memiliki keimanan dan ketakwaan yang kuat, menguasai ilmu pengetahuan dan teknologi, memiliki akhlak mulia, serta mampu bersaing di tingkat nasional dan internasional.',
 1),
('SMPIT', 'SMPIT Baitul Jannah',
 'Menjadi sekolah menengah pertama Islam terpadu yang unggul dalam mencetak generasi Qur\'ani yang berakhlak mulia, berprestasi akademik tinggi, dan siap menghadapi tantangan global.',
 'Menyelenggarakan pendidikan menengah pertama Islam terpadu yang berkualitas tinggi, mengintegrasikan kurikulum nasional dengan nilai-nilai Islam, mengembangkan potensi akademik dan karakter siswa, serta mempersiapkan siswa untuk melanjutkan ke jenjang pendidikan yang lebih tinggi.',
 'Menghasilkan lulusan yang memiliki keimanan dan ketakwaan yang kokoh, menguasai ilmu pengetahuan dan teknologi, memiliki akhlak mulia, kemampuan kepemimpinan, dan daya saing tinggi di era global.',
 1),
('SMAIT', 'SMAIT Baitul Jannah',
 'Menjadi sekolah menengah atas Islam terpadu yang unggul dalam mencetak generasi Qur\'ani yang berakhlak mulia, berprestasi akademik tinggi, dan siap menjadi pemimpin masa depan.',
 'Menyelenggarakan pendidikan menengah atas Islam terpadu yang berkualitas tinggi, mengintegrasikan kurikulum nasional dengan nilai-nilai Islam, mengembangkan potensi akademik dan karakter siswa, serta mempersiapkan siswa untuk melanjutkan ke perguruan tinggi terbaik.',
 'Menghasilkan lulusan yang memiliki keimanan dan ketakwaan yang kokoh, menguasai ilmu pengetahuan dan teknologi, memiliki akhlak mulia, jiwa kepemimpinan, dan siap bersaing di perguruan tinggi terbaik nasional dan internasional.',
 1),
('SLBIT', 'SLBIT Baitul Jannah',
 'Menjadi sekolah luar biasa Islam terpadu yang unggul dalam memberikan pendidikan khusus bagi anak berkebutuhan khusus dengan pendekatan Islami yang komprehensif.',
 'Menyelenggarakan pendidikan khusus yang berkualitas bagi anak berkebutuhan khusus, mengintegrasikan terapi dan pendidikan dengan nilai-nilai Islam, mengembangkan potensi anak sesuai kemampuannya, dan membangun kemandirian serta kepercayaan diri.',
 'Menghasilkan peserta didik berkebutuhan khusus yang memiliki keimanan yang kuat, kemampuan sesuai potensinya, kemandirian dalam kehidupan sehari-hari, dan dapat berpartisipasi aktif dalam masyarakat.',
 1);