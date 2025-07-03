-- Menambahkan kolom baru ke tabel pendaftaran
ALTER TABLE `pendaftaran`
ADD COLUMN `nomor_telepon_ayah` varchar(20) DEFAULT NULL AFTER `pekerjaan_ayah`,
ADD COLUMN `nomor_telepon_ibu` varchar(20) DEFAULT NULL AFTER `pekerjaan_ibu`,
ADD COLUMN `nama_wali` varchar(255) DEFAULT NULL AFTER `telepon_ortu`,
ADD COLUMN `hubungan_wali` varchar(100) DEFAULT NULL AFTER `nama_wali`,
ADD COLUMN `tahun_lulus` varchar(10) DEFAULT NULL AFTER `asal_sekolah`,
ADD COLUMN `prestasi` text DEFAULT NULL AFTER `tahun_lulus`;

-- Mengubah nilai default status menjadi 'pending'
ALTER TABLE `pendaftaran`
MODIFY COLUMN `status` enum('menunggu','pending','diterima','ditolak','cadangan') NOT NULL DEFAULT 'pending';