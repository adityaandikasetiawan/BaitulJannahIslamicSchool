# Baitul Jannah Islamic School

Aplikasi web untuk manajemen Baitul Jannah Islamic School menggunakan Node.js, Express, dan MySQL.

## Fitur

- Dashboard Admin
- Manajemen Pengguna
- Manajemen Berita
- Manajemen Pengumuman
- Manajemen Agenda
- Manajemen Galeri

## Teknologi

- Node.js
- Express.js
- MySQL
- EJS Template Engine
- Bootstrap 5

## Persyaratan

- Node.js (versi 14 atau lebih tinggi)
- NPM (versi 6 atau lebih tinggi)
- MySQL Server (versi 8.0 atau lebih tinggi)

## Instalasi

1. Install MySQL Server
   - Download MySQL Installer dari [situs resmi MySQL](https://dev.mysql.com/downloads/installer/)
   - Pilih "MySQL Server" dan "MySQL Workbench" saat instalasi
   - Buat password root saat diminta
   - Pastikan service MySQL berjalan

2. Clone repositori ini

```bash
git clone https://github.com/username/baitul-jannah-islamic-school.git
cd baitul-jannah-islamic-school
```

3. Install dependensi

```bash
npm install
```

4. Buat database dan tabel
   - Buka MySQL Workbench
   - Hubungkan ke server MySQL lokal dengan kredensial berikut:
     * Hostname: localhost
     * Port: 3306
     * Username: root
     * Password: (password yang dibuat saat instalasi MySQL)
   - Setelah terhubung, buat database dengan cara:
     * Klik File > Open SQL Script
     * Pilih file `config/database.sql` dari folder proyek
     * Klik tombol Execute (petir) untuk menjalankan script
     * Script akan membuat database `baitul_jannah_db` dan tabel-tabel yang diperlukan
   - Pastikan tidak ada error saat menjalankan script

5. Siapkan file .env

```
# Server Configuration
PORT=3000
SESSION_SECRET=your_session_secret_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=baitul_jannah_db

# Other Configuration
UPLOAD_PATH=uploads/
```

6. Jalankan aplikasi

```bash
# Mode production
npm start

# Mode development dengan auto-reload
npm run dev
```

## Troubleshooting

### Masalah Koneksi Database

Jika muncul error "Unknown database 'baitul_jannah_db'", ikuti langkah berikut:

1. Pastikan MySQL Server sudah berjalan
   - Windows: Cek di Task Manager > Services > MySQL80
   - Jika tidak berjalan, start service MySQL80

2. Pastikan database sudah dibuat
   - Buka MySQL Workbench
   - Hubungkan ke server lokal
   - Di Navigator, pastikan ada database `baitul_jannah_db`
   - Jika tidak ada, jalankan script `config/database.sql`

3. Periksa file .env
   - Pastikan konfigurasi database sesuai:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=baitul_jannah_db
     ```
   - Sesuaikan `DB_PASSWORD` dengan password MySQL Anda

## Struktur Direktori

```
├── assets/             # File statis (CSS, JS, gambar)
├── config/             # File konfigurasi
│   ├── database.js     # Konfigurasi MySQL
│   ├── database.sql    # File SQL untuk membuat tabel
│   └── passport.js     # Konfigurasi Passport.js
├── middleware/         # Middleware Express
├── models/             # Model data
│   ├── User.js         # Model User
│   ├── Agenda.js       # Model Agenda
│   ├── Berita.js       # Model Berita
│   ├── Galeri.js       # Model Galeri
│   └── Pengumuman.js   # Model Pengumuman
├── routes/             # Route Express
├── views/              # Template EJS
├── .env                # Variabel lingkungan
└── server.js           # Entry point aplikasi
```

## Pengembangan

1. Pastikan MySQL server berjalan
2. Buat database dan import struktur tabel menggunakan MySQL Workbench
3. Sesuaikan konfigurasi database di file .env
4. Jalankan aplikasi dalam mode development dengan `npm run dev`

## Kontribusi

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distribusikan di bawah Lisensi ISC. Lihat `LICENSE` untuk informasi lebih lanjut.