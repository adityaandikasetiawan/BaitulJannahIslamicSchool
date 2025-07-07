-- Tabel untuk carousel beranda
CREATE TABLE IF NOT EXISTS `beranda_carousel` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `judul` VARCHAR(255) NOT NULL,
  `subjudul` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT,
  `gambar` VARCHAR(255),
  `urutan` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk bagian visi/icon di beranda
CREATE TABLE IF NOT EXISTS `beranda_vision` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `judul` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(255) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `urutan` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk bagian about di beranda
CREATE TABLE IF NOT EXISTS `beranda_about` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `judul` VARCHAR(255) NOT NULL,
  `subjudul` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `gambar1` VARCHAR(255),
  `gambar2` VARCHAR(255),
  `gambar3` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk bagian statistik di beranda
CREATE TABLE IF NOT EXISTS `beranda_stats` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `judul` VARCHAR(255) NOT NULL,
  `nilai` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk pengaturan carousel beranda
CREATE TABLE IF NOT EXISTS `beranda_carousel_settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `autoplay` BOOLEAN NOT NULL DEFAULT TRUE,
  `interval` INT NOT NULL DEFAULT 5000,
  `showIndicators` BOOLEAN NOT NULL DEFAULT TRUE,
  `showControls` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data awal untuk carousel
INSERT INTO `beranda_carousel` (`judul`, `subjudul`, `deskripsi`, `gambar`, `urutan`) VALUES
('Sekolah Islam Terpadu', 'Pendidikan Berkualitas dengan Nilai-nilai Islam', 'Membentuk generasi yang unggul dalam ilmu pengetahuan dan berakhlak mulia sesuai dengan nilai-nilai Al-Qur\'an dan Sunnah.', '/assets/img/hero/hero-3.jpg', 1),
('Pendidikan Islam Terpadu', 'Membentuk Generasi Qurani yang Berakhlak Mulia', 'Baitul Jannah Islamic School mengintegrasikan kurikulum nasional dengan nilai-nilai Islam untuk membentuk karakter siswa yang unggul.', '/assets/img/course/course-01.jpg', 2),
('Fasilitas Modern & Lengkap', 'Lingkungan Belajar yang Nyaman dan Kondusif', 'Dilengkapi dengan fasilitas modern, laboratorium komputer, perpustakaan digital, dan area bermain yang aman untuk mendukung proses pembelajaran optimal.', '/assets/img/gallery/gallery-5.jpg', 3);

-- Data awal untuk vision
INSERT INTO `beranda_vision` (`judul`, `icon`, `link`, `urutan`) VALUES
('Dauroh Qur\'an', '/assets/img/icon/book.svg', '/daurohquran', 1),
('Student Project Assessment', '/assets/img/icon/user-tick.svg', '/studentproject', 2),
('Ekstrakurikuler', '/assets/img/icons/category-icon3.svg', '/ekstrakurikuler', 3),
('Alumni', '/assets/img/icon/graduation.svg', '/alumni', 4);

-- Data awal untuk about
INSERT INTO `beranda_about` (`judul`, `subjudul`, `deskripsi`, `gambar1`, `gambar2`, `gambar3`) VALUES
('Belajar di Baitul Jannah Islamic School', 'Pendidikan Islam Terpadu dengan Kurikulum Modern', 'Baitul Jannah Islamic School menawarkan pendidikan berkualitas yang memadukan nilai-nilai Islam dengan kurikulum nasional. Kami mempersiapkan siswa untuk menjadi generasi Muslim yang berakhlak mulia, berwawasan luas, dan siap menghadapi tantangan global dengan tetap berpegang pada ajaran Islam.', '/assets/img/about/about-3.jpg', '/assets/img/about/about-4.jpg', '/assets/img/about/about-5.jpg');

-- Data awal untuk stats
INSERT INTO `beranda_stats` (`judul`, `nilai`, `icon`) VALUES
('Jenjang Pendidikan', '4', '/assets/img/icons/count-one.svg'),
('Guru Profesional', '50+', '/assets/img/icons/count-two.svg'),
('Program Unggulan', '15+', '/assets/img/icons/count-three.svg'),
('Siswa Aktif', '500+', '/assets/img/icons/count-four.svg');

-- Data awal untuk pengaturan carousel
INSERT INTO `beranda_carousel_settings` (`autoplay`, `interval`, `showIndicators`, `showControls`) VALUES
(TRUE, 5000, TRUE, TRUE);