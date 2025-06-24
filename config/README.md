# Konfigurasi Firebase

Folder ini berisi file konfigurasi untuk Firebase. Untuk alasan keamanan, file kredensial Firebase (`firebase-key.json`) tidak disertakan dalam repositori.

## Cara Mengatur Kredensial Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Buka Project Settings > Service Accounts
3. Klik "Generate New Private Key"
4. Simpan file JSON yang diunduh sebagai `firebase-key.json` di folder ini

## Contoh Format

File `firebase-key.example.json` disediakan sebagai contoh format. Jangan gunakan file ini untuk produksi, ini hanya template.

## Keamanan

Jangan pernah meng-commit file kredensial Firebase ke repositori Git. File tersebut berisi informasi sensitif yang dapat disalahgunakan jika terekspos.