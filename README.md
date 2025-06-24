# Baitul Jannah Islamic School

Aplikasi web untuk manajemen Baitul Jannah Islamic School menggunakan Node.js, Express, dan Firebase.

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
- Firebase (Firestore & Storage)
- EJS Template Engine
- Bootstrap 5

## Persyaratan

- Node.js (versi 14 atau lebih tinggi)
- NPM (versi 6 atau lebih tinggi)
- Akun Firebase

## Instalasi

1. Clone repositori ini

```bash
git clone https://github.com/username/baitul-jannah-islamic-school.git
cd baitul-jannah-islamic-school
```

2. Install dependensi

```bash
npm install
```

3. Siapkan file .env

```
SESSION_SECRET=your_session_secret
PORT=3002
FIREBASE_STORAGE_BUCKET=baitul-jannah-islamic-school.appspot.com
FIREBASE_PROJECT_ID=baitul-jannah-islamic-school
```

4. Pastikan file konfigurasi Firebase (`config/firebase-key.json`) sudah ada dan berisi kredensial yang valid

5. Jalankan aplikasi

```bash
# Menggunakan MongoDB (versi lama)
node server.js

# Menggunakan Firebase (versi baru)
node serverFirebase.js
```

## Migrasi dari MongoDB ke Firebase

Untuk memigrasikan data dari MongoDB ke Firebase, jalankan:

```bash
node utils/migrateToFirebase.js
```

Pastikan MongoDB dan Firebase sudah dikonfigurasi dengan benar sebelum menjalankan migrasi.

## Struktur Direktori

```
├── assets/             # File statis (CSS, JS, gambar)
├── config/             # File konfigurasi
│   ├── firebase.js     # Konfigurasi Firebase
│   ├── firebase-key.json # Kredensial Firebase
│   ├── passport.js     # Konfigurasi Passport.js untuk MongoDB
│   └── passportFirebase.js # Konfigurasi Passport.js untuk Firebase
├── middleware/         # Middleware Express
├── models/             # Model data
│   ├── User.js         # Model User untuk MongoDB
│   ├── UserFirebase.js # Model User untuk Firebase
│   └── ...
├── routes/             # Route Express
├── utils/              # Utilitas
│   ├── firebaseStorage.js # Utilitas untuk Firebase Storage
│   └── migrateToFirebase.js # Script migrasi dari MongoDB ke Firebase
├── views/              # Template EJS
├── .env                # Variabel lingkungan
├── server.js           # Entry point aplikasi (MongoDB)
└── serverFirebase.js   # Entry point aplikasi (Firebase)
```

## Akses Admin

Untuk mengakses dashboard admin:

1. Buka http://localhost:3002/login
2. Masuk dengan kredensial admin (email: admin@example.com, password: password123)
3. Setelah login, akses http://localhost:3002/admin/dashboard

## Lisensi

MIT