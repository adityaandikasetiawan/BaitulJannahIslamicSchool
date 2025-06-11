const express = require('express');
const path = require('path');
const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware untuk parsing body requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Baitul Jannah Islamic School',
        description: 'Sekolah Para Juara'
    });
});

// Route untuk halaman kontak
app.get('/kontak', (req, res) => {
    res.render('kontak', {
        title: 'Hubungi Kami - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
    });
}); 
app.get('/sejarahyayasan', (req, res) => {
    res.render('sejarahyayasan', {
        title: 'Sejarah Yayasan - Baitul Jannah Islamic School',
        description: 'Sejarah dan perkembangan Yayasan Baitul Jannah Islamic School'
    });
});
app.get('/beritaterbaru', (req, res) => {
    res.render('beritaterbaru', {
        title: 'Berita Terbaru - Baitul Jannah Islamic School',
        description: 'Berita terbaru dan informasi terkini dari Baitul Jannah Islamic School'
    });
});
app.get('/comingsoon', (req, res) => {
    res.render('comingsoon', {
        title: 'Comingsoon - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
    });
});
app.get('/prestasi', (req, res) => {
    res.render('kontak', {
        title: 'Hubungi Kami - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
    });
});
app.get('/karya', (req, res) => {
    res.render('kontak', {
        title: 'Hubungi Kami - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
    });
});
app.get('/foto', (req, res) => {
    res.render('kontak', {
        title: 'Hubungi Kami - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
    });
});
app.get('/video', (req, res) => {
    res.render('kontak', {
        title: 'Hubungi Kami - Baitul Jannah Islamic School',
        description: 'Hubungi Baitul Jannah Islamic School untuk informasi lebih lanjut'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).send('Halaman tidak ditemukan');
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan pada server');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});