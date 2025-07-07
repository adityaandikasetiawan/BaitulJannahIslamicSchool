# Sistem Manajemen Profil Sekolah

## Deskripsi
Sistem manajemen profil sekolah untuk Baitul Jannah Islamic School yang memungkinkan admin untuk mengelola profil dari 5 jenjang pendidikan:
- PGIT-TKIT (Pendidikan Guru Islam Terpadu - Taman Kanak-kanak Islam Terpadu)
- SDIT (Sekolah Dasar Islam Terpadu)
- SMPIT (Sekolah Menengah Pertama Islam Terpadu)
- SMAIT (Sekolah Menengah Atas Islam Terpadu)
- SLBIT (Sekolah Luar Biasa Islam Terpadu)

## Fitur

### 1. Model Sekolah (`models/Sekolah.js`)
- **CRUD Operations**: Create, Read, Update, Delete profil sekolah
- **Pencarian berdasarkan jenjang**: `findByJenjang(jenjang)`
- **Update berdasarkan jenjang**: `updateByJenjang(jenjang, data)`
- **Validasi data**: Memastikan integritas data profil sekolah

### 2. Database Schema (`migrations/create_sekolah_table.sql`)
```sql
CREATE TABLE sekolah (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Admin Routes (`routes/admin.js`)

#### GET Routes
- `/admin/profile/pgit` - Halaman profil PGIT-TKIT
- `/admin/profile/sdit` - Halaman profil SDIT
- `/admin/profile/smpit` - Halaman profil SMPIT
- `/admin/profile/smait` - Halaman profil SMAIT
- `/admin/profile/slbit` - Halaman profil SLBIT

#### POST Routes
- `/admin/profile/update/:jenjang` - Update profil sekolah berdasarkan jenjang

### 4. Views (EJS Templates)

#### Struktur File Views
```
views/admin/profile/
├── pgit.ejs     # Form profil PGIT-TKIT
├── sdit.ejs     # Form profil SDIT
├── smpit.ejs    # Form profil SMPIT
├── smait.ejs    # Form profil SMAIT
└── slbit.ejs    # Form profil SLBIT
```

#### Fitur Form
- **Navigasi Tab**: Mudah berpindah antar jenjang
- **Upload File**: Logo sekolah dan gambar utama
- **Validasi**: Form validation untuk field wajib
- **Preview Gambar**: Menampilkan gambar yang sudah diupload
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar

## Penggunaan

### 1. Akses Halaman Profil
1. Login sebagai admin
2. Navigasi ke `/admin/profile/{jenjang}`
3. Pilih jenjang yang ingin dikelola melalui tab navigasi

### 2. Mengelola Profil Sekolah
1. **Mengisi Data Dasar**:
   - Nama sekolah
   - Kepala sekolah
   - Visi, misi, dan tujuan
   - Sejarah sekolah

2. **Mengisi Informasi Kontak**:
   - Alamat lengkap
   - Nomor telepon
   - Email
   - Website

3. **Upload Media**:
   - Logo sekolah (format: JPG, PNG, GIF)
   - Gambar utama sekolah

4. **Pengaturan Status**:
   - Aktif: Profil ditampilkan di website
   - Non-aktif: Profil disembunyikan

### 3. Menyimpan Perubahan
1. Isi semua field yang diperlukan
2. Upload file jika diperlukan
3. Klik tombol "Simpan Perubahan"
4. Sistem akan memberikan notifikasi sukses/error

## Keamanan

### 1. Autentikasi
- Hanya admin yang dapat mengakses halaman profil
- Middleware `ensureAuthenticated` dan `isAdmin`

### 2. Upload File
- Validasi tipe file (hanya gambar)
- Penamaan file otomatis dengan timestamp
- Penghapusan file lama saat upload baru

### 3. Validasi Data
- Server-side validation untuk semua input
- Sanitasi data sebelum disimpan ke database
- Protection terhadap SQL injection

## Data Default

Sistem sudah dilengkapi dengan data default untuk setiap jenjang:
- Visi, misi, dan tujuan yang sesuai dengan karakteristik masing-masing jenjang
- Nama sekolah default
- Status aktif untuk semua jenjang

## Troubleshooting

### 1. Error Upload File
- Pastikan folder `public/uploads` memiliki permission write
- Periksa ukuran file (maksimal sesuai konfigurasi multer)
- Pastikan format file yang diupload adalah gambar

### 2. Error Database
- Pastikan tabel `sekolah` sudah dibuat
- Periksa koneksi database
- Pastikan user database memiliki permission yang cukup

### 3. Error Navigasi
- Pastikan semua route sudah terdaftar di `admin.js`
- Periksa middleware autentikasi
- Pastikan file view tersedia

## Pengembangan Lanjutan

### 1. Fitur yang Bisa Ditambahkan
- **Galeri Foto**: Multiple image upload untuk setiap jenjang
- **Fasilitas**: Manajemen daftar fasilitas sekolah
- **Prestasi**: Pencatatan prestasi sekolah
- **Struktur Organisasi**: Manajemen struktur kepegawaian
- **Kurikulum**: Detail kurikulum untuk setiap jenjang

### 2. Optimisasi
- **Caching**: Implementasi cache untuk data profil
- **Image Optimization**: Kompresi otomatis gambar yang diupload
- **SEO**: Meta tags dinamis berdasarkan profil sekolah
- **API**: REST API untuk integrasi dengan aplikasi mobile

### 3. Monitoring
- **Audit Log**: Pencatatan perubahan profil
- **Analytics**: Statistik pengunjung halaman profil
- **Backup**: Sistem backup otomatis data profil

## Kontribusi

Untuk berkontribusi pada pengembangan sistem ini:
1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

Sistem ini dikembangkan untuk Baitul Jannah Islamic School dan dilindungi oleh lisensi internal.