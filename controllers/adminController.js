const Akademik = require('../models/Akademik');
const Informasi = require('../models/Informasi');
const Kegiatan = require('../models/Kegiatan');
const TentangKami = require('../models/TentangKami');
const Galeri = require('../models/Galeri');
const Kontak = require('../models/Kontak');
const fs = require('fs');
const path = require('path');

// Helper function untuk menghapus file
const deleteFile = (filePath) => {
    if (!filePath) return;
    
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

// Dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Mengambil data untuk statistik dan informasi dashboard
        const [akademikCount, informasiCount, kegiatanCount, tentangKamiCount, galeriCount] = await Promise.all([
            Akademik.count(),
            Informasi.count(),
            Kegiatan.count(),
            TentangKami.count(),
            Galeri.count()
        ]);

        // Mengambil pengumuman terbaru
        const pengumuman = await Informasi.findByJenis('pengumuman', 5);
        
        // Mengambil kegiatan mendatang
        const kegiatan = await Kegiatan.findUpcoming(5);

        res.render('admin/dashboard', {
            title: 'Dashboard Admin',
            user: req.user,
            counts: {
                akademik: akademikCount,
                informasi: informasiCount,
                kegiatan: kegiatanCount,
                tentangKami: tentangKamiCount,
                galeri: galeriCount
            },
            pengumuman,
            kegiatan,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getDashboard:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat dashboard');
        res.redirect('/admin/dashboard');
    }
};

// ===== AKADEMIK =====

// Menampilkan daftar akademik
exports.getAkademik = async (req, res) => {
    try {
        const akademik = await Akademik.findAll();
        res.render('admin/akademik/index', {
            title: 'Kelola Akademik',
            akademik,
            user: req.user,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getAkademik:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data akademik');
        res.redirect('/admin/dashboard');
    }
};

// Menampilkan form tambah akademik
exports.getTambahAkademik = (req, res) => {
    res.render('admin/akademik/tambah', {
        title: 'Tambah Akademik',
        user: req.user,
        error_msg: req.flash('error')
    });
};

// Proses tambah akademik
exports.postTambahAkademik = async (req, res) => {
    try {
        const { judul, jenis, deskripsi, status } = req.body;
        let gambar = null;
        let dokumen = null;

        // Proses upload gambar jika ada
        if (req.files && req.files.gambar) {
            const gambarFile = req.files.gambar;
            const gambarFileName = `akademik_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/akademik/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'akademik');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Proses upload dokumen jika ada
        if (req.files && req.files.dokumen) {
            const dokumenFile = req.files.dokumen;
            const dokumenFileName = `akademik_${Date.now()}_${dokumenFile.name}`;
            const dokumenPath = `/uploads/dokumen/${dokumenFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'dokumen');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await dokumenFile.mv(path.join(uploadDir, dokumenFileName));
            dokumen = dokumenPath;
        }

        // Simpan ke database
        await Akademik.create({
            judul,
            jenis,
            deskripsi,
            gambar,
            dokumen,
            status,
            created_by: req.user.id
        });

        req.flash('success', 'Data akademik berhasil ditambahkan');
        res.redirect('/admin/akademik');
    } catch (error) {
        console.error('Error in postTambahAkademik:', error);
        req.flash('error', 'Terjadi kesalahan saat menambahkan data akademik');
        res.redirect('/admin/akademik/tambah');
    }
};

// Menampilkan form edit akademik
exports.getEditAkademik = async (req, res) => {
    try {
        const id = req.params.id;
        const akademik = await Akademik.findById(id);
        
        if (!akademik) {
            req.flash('error', 'Data akademik tidak ditemukan');
            return res.redirect('/admin/akademik');
        }
        
        res.render('admin/akademik/edit', {
            title: 'Edit Akademik',
            akademik,
            user: req.user,
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getEditAkademik:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data akademik');
        res.redirect('/admin/akademik');
    }
};

// Proses edit akademik
exports.postEditAkademik = async (req, res) => {
    try {
        const id = req.params.id;
        const { judul, jenis, deskripsi, status } = req.body;
        
        // Ambil data lama
        const oldData = await Akademik.findById(id);
        if (!oldData) {
            req.flash('error', 'Data akademik tidak ditemukan');
            return res.redirect('/admin/akademik');
        }
        
        let gambar = oldData.gambar;
        let dokumen = oldData.dokumen;

        // Proses upload gambar baru jika ada
        if (req.files && req.files.gambar) {
            // Hapus gambar lama jika ada
            if (oldData.gambar) {
                deleteFile(`public${oldData.gambar}`);
            }
            
            const gambarFile = req.files.gambar;
            const gambarFileName = `akademik_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/akademik/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'akademik');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Proses upload dokumen baru jika ada
        if (req.files && req.files.dokumen) {
            // Hapus dokumen lama jika ada
            if (oldData.dokumen) {
                deleteFile(`public${oldData.dokumen}`);
            }
            
            const dokumenFile = req.files.dokumen;
            const dokumenFileName = `akademik_${Date.now()}_${dokumenFile.name}`;
            const dokumenPath = `/uploads/dokumen/${dokumenFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'dokumen');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await dokumenFile.mv(path.join(uploadDir, dokumenFileName));
            dokumen = dokumenPath;
        }

        // Update data
        await Akademik.update(id, {
            judul,
            jenis,
            deskripsi,
            gambar,
            dokumen,
            status,
            updated_by: req.user.id
        });

        req.flash('success', 'Data akademik berhasil diperbarui');
        res.redirect('/admin/akademik');
    } catch (error) {
        console.error('Error in postEditAkademik:', error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui data akademik');
        res.redirect(`/admin/akademik/edit/${req.params.id}`);
    }
};

// Proses hapus akademik
exports.deleteAkademik = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Ambil data untuk menghapus file terkait
        const akademik = await Akademik.findById(id);
        if (!akademik) {
            return res.status(404).json({ success: false, message: 'Data akademik tidak ditemukan' });
        }
        
        // Hapus file gambar jika ada
        if (akademik.gambar) {
            deleteFile(`public${akademik.gambar}`);
        }
        
        // Hapus file dokumen jika ada
        if (akademik.dokumen) {
            deleteFile(`public${akademik.dokumen}`);
        }
        
        // Hapus data dari database
        await Akademik.delete(id);
        
        res.json({ success: true, message: 'Data akademik berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteAkademik:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data akademik' });
    }
};

// ===== INFORMASI =====

// Menampilkan daftar informasi
exports.getInformasi = async (req, res) => {
    try {
        const informasi = await Informasi.findAll();
        res.render('admin/informasi/index', {
            title: 'Kelola Informasi',
            informasi,
            user: req.user,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getInformasi:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data informasi');
        res.redirect('/admin/dashboard');
    }
};

// Menampilkan form tambah informasi
exports.getTambahInformasi = (req, res) => {
    res.render('admin/informasi/tambah', {
        title: 'Tambah Informasi',
        user: req.user,
        error_msg: req.flash('error')
    });
};

// Proses tambah informasi
exports.postTambahInformasi = async (req, res) => {
    try {
        const { judul, jenis, konten, status } = req.body;
        let gambar = null;
        let dokumen = null;

        // Proses upload gambar jika ada
        if (req.files && req.files.gambar) {
            const gambarFile = req.files.gambar;
            const gambarFileName = `informasi_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/informasi/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'informasi');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Proses upload dokumen jika ada
        if (req.files && req.files.dokumen) {
            const dokumenFile = req.files.dokumen;
            const dokumenFileName = `informasi_${Date.now()}_${dokumenFile.name}`;
            const dokumenPath = `/uploads/dokumen/${dokumenFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'dokumen');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await dokumenFile.mv(path.join(uploadDir, dokumenFileName));
            dokumen = dokumenPath;
        }

        // Simpan ke database
        await Informasi.create({
            judul,
            jenis,
            konten,
            gambar,
            dokumen,
            status,
            created_by: req.user.id
        });

        req.flash('success', 'Data informasi berhasil ditambahkan');
        res.redirect('/admin/informasi');
    } catch (error) {
        console.error('Error in postTambahInformasi:', error);
        req.flash('error', 'Terjadi kesalahan saat menambahkan data informasi');
        res.redirect('/admin/informasi/tambah');
    }
};

// Menampilkan form edit informasi
exports.getEditInformasi = async (req, res) => {
    try {
        const id = req.params.id;
        const informasi = await Informasi.findById(id);
        
        if (!informasi) {
            req.flash('error', 'Data informasi tidak ditemukan');
            return res.redirect('/admin/informasi');
        }
        
        res.render('admin/informasi/edit', {
            title: 'Edit Informasi',
            informasi,
            user: req.user,
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getEditInformasi:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data informasi');
        res.redirect('/admin/informasi');
    }
};

// Proses edit informasi
exports.postEditInformasi = async (req, res) => {
    try {
        const id = req.params.id;
        const { judul, jenis, konten, status } = req.body;
        
        // Ambil data lama
        const oldData = await Informasi.findById(id);
        if (!oldData) {
            req.flash('error', 'Data informasi tidak ditemukan');
            return res.redirect('/admin/informasi');
        }
        
        let gambar = oldData.gambar;
        let dokumen = oldData.dokumen;

        // Proses upload gambar baru jika ada
        if (req.files && req.files.gambar) {
            // Hapus gambar lama jika ada
            if (oldData.gambar) {
                deleteFile(`public${oldData.gambar}`);
            }
            
            const gambarFile = req.files.gambar;
            const gambarFileName = `informasi_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/informasi/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'informasi');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Proses upload dokumen baru jika ada
        if (req.files && req.files.dokumen) {
            // Hapus dokumen lama jika ada
            if (oldData.dokumen) {
                deleteFile(`public${oldData.dokumen}`);
            }
            
            const dokumenFile = req.files.dokumen;
            const dokumenFileName = `informasi_${Date.now()}_${dokumenFile.name}`;
            const dokumenPath = `/uploads/dokumen/${dokumenFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'dokumen');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await dokumenFile.mv(path.join(uploadDir, dokumenFileName));
            dokumen = dokumenPath;
        }

        // Update data
        await Informasi.update(id, {
            judul,
            jenis,
            konten,
            gambar,
            dokumen,
            status,
            updated_by: req.user.id
        });

        req.flash('success', 'Data informasi berhasil diperbarui');
        res.redirect('/admin/informasi');
    } catch (error) {
        console.error('Error in postEditInformasi:', error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui data informasi');
        res.redirect(`/admin/informasi/edit/${req.params.id}`);
    }
};

// Proses hapus informasi
exports.deleteInformasi = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Ambil data untuk menghapus file terkait
        const informasi = await Informasi.findById(id);
        if (!informasi) {
            return res.status(404).json({ success: false, message: 'Data informasi tidak ditemukan' });
        }
        
        // Hapus file gambar jika ada
        if (informasi.gambar) {
            deleteFile(`public${informasi.gambar}`);
        }
        
        // Hapus file dokumen jika ada
        if (informasi.dokumen) {
            deleteFile(`public${informasi.dokumen}`);
        }
        
        // Hapus data dari database
        await Informasi.delete(id);
        
        res.json({ success: true, message: 'Data informasi berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteInformasi:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data informasi' });
    }
};

// ===== KEGIATAN =====

// Menampilkan daftar kegiatan
exports.getKegiatan = async (req, res) => {
    try {
        const kegiatan = await Kegiatan.findAll();
        res.render('admin/kegiatan/index', {
            title: 'Kelola Kegiatan',
            kegiatan,
            user: req.user,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getKegiatan:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data kegiatan');
        res.redirect('/admin/dashboard');
    }
};

// Menampilkan form tambah kegiatan
exports.getTambahKegiatan = (req, res) => {
    res.render('admin/kegiatan/tambah', {
        title: 'Tambah Kegiatan',
        user: req.user,
        error_msg: req.flash('error')
    });
};

// Proses tambah kegiatan
exports.postTambahKegiatan = async (req, res) => {
    try {
        const { judul, jenis, deskripsi, tanggal, waktu_mulai, waktu_selesai, lokasi, status } = req.body;
        let gambar = null;

        // Proses upload gambar jika ada
        if (req.files && req.files.gambar) {
            const gambarFile = req.files.gambar;
            const gambarFileName = `kegiatan_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/kegiatan/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'kegiatan');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Simpan ke database
        await Kegiatan.create({
            judul,
            jenis,
            deskripsi,
            tanggal,
            waktu_mulai,
            waktu_selesai,
            lokasi,
            gambar,
            status,
            created_by: req.user.id
        });

        req.flash('success', 'Data kegiatan berhasil ditambahkan');
        res.redirect('/admin/kegiatan');
    } catch (error) {
        console.error('Error in postTambahKegiatan:', error);
        req.flash('error', 'Terjadi kesalahan saat menambahkan data kegiatan');
        res.redirect('/admin/kegiatan/tambah');
    }
};

// Menampilkan form edit kegiatan
exports.getEditKegiatan = async (req, res) => {
    try {
        const id = req.params.id;
        const kegiatan = await Kegiatan.findById(id);
        
        if (!kegiatan) {
            req.flash('error', 'Data kegiatan tidak ditemukan');
            return res.redirect('/admin/kegiatan');
        }
        
        res.render('admin/kegiatan/edit', {
            title: 'Edit Kegiatan',
            kegiatan,
            user: req.user,
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getEditKegiatan:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data kegiatan');
        res.redirect('/admin/kegiatan');
    }
};

// Proses edit kegiatan
exports.postEditKegiatan = async (req, res) => {
    try {
        const id = req.params.id;
        const { judul, jenis, deskripsi, tanggal, waktu_mulai, waktu_selesai, lokasi, status } = req.body;
        
        // Ambil data lama
        const oldData = await Kegiatan.findById(id);
        if (!oldData) {
            req.flash('error', 'Data kegiatan tidak ditemukan');
            return res.redirect('/admin/kegiatan');
        }
        
        let gambar = oldData.gambar;

        // Proses upload gambar baru jika ada
        if (req.files && req.files.gambar) {
            // Hapus gambar lama jika ada
            if (oldData.gambar) {
                deleteFile(`public${oldData.gambar}`);
            }
            
            const gambarFile = req.files.gambar;
            const gambarFileName = `kegiatan_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/kegiatan/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'kegiatan');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Update data
        await Kegiatan.update(id, {
            judul,
            jenis,
            deskripsi,
            tanggal,
            waktu_mulai,
            waktu_selesai,
            lokasi,
            gambar,
            status,
            updated_by: req.user.id
        });

        req.flash('success', 'Data kegiatan berhasil diperbarui');
        res.redirect('/admin/kegiatan');
    } catch (error) {
        console.error('Error in postEditKegiatan:', error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui data kegiatan');
        res.redirect(`/admin/kegiatan/edit/${req.params.id}`);
    }
};

// Proses hapus kegiatan
exports.deleteKegiatan = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Ambil data untuk menghapus file terkait
        const kegiatan = await Kegiatan.findById(id);
        if (!kegiatan) {
            return res.status(404).json({ success: false, message: 'Data kegiatan tidak ditemukan' });
        }
        
        // Hapus file gambar jika ada
        if (kegiatan.gambar) {
            deleteFile(`public${kegiatan.gambar}`);
        }
        
        // Hapus data dari database
        await Kegiatan.delete(id);
        
        res.json({ success: true, message: 'Data kegiatan berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteKegiatan:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data kegiatan' });
    }
};

// ===== TENTANG KAMI =====

// Menampilkan daftar tentang kami
exports.getTentangKami = async (req, res) => {
    try {
        const tentangKami = await TentangKami.findAll();
        res.render('admin/tentangkami/index', {
            title: 'Kelola Tentang Kami',
            tentangKami,
            user: req.user,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getTentangKami:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data tentang kami');
        res.redirect('/admin/dashboard');
    }
};

// Menampilkan form tambah tentang kami
exports.getTambahTentangKami = (req, res) => {
    res.render('admin/tentangkami/tambah', {
        title: 'Tambah Tentang Kami',
        user: req.user,
        error_msg: req.flash('error')
    });
};

// Proses tambah tentang kami
exports.postTambahTentangKami = async (req, res) => {
    try {
        const { judul, jenis, konten, status } = req.body;
        let gambar = null;

        // Proses upload gambar jika ada
        if (req.files && req.files.gambar) {
            const gambarFile = req.files.gambar;
            const gambarFileName = `tentangkami_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/tentangkami/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'tentangkami');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Simpan ke database
        await TentangKami.create({
            judul,
            jenis,
            konten,
            gambar,
            status,
            created_by: req.user.id
        });

        req.flash('success', 'Data tentang kami berhasil ditambahkan');
        res.redirect('/admin/tentangkami');
    } catch (error) {
        console.error('Error in postTambahTentangKami:', error);
        req.flash('error', 'Terjadi kesalahan saat menambahkan data tentang kami');
        res.redirect('/admin/tentangkami/tambah');
    }
};

// Menampilkan form edit tentang kami
exports.getEditTentangKami = async (req, res) => {
    try {
        const id = req.params.id;
        const tentangKami = await TentangKami.findById(id);
        
        if (!tentangKami) {
            req.flash('error', 'Data tentang kami tidak ditemukan');
            return res.redirect('/admin/tentangkami');
        }
        
        res.render('admin/tentangkami/edit', {
            title: 'Edit Tentang Kami',
            tentangKami,
            user: req.user,
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getEditTentangKami:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data tentang kami');
        res.redirect('/admin/tentangkami');
    }
};

// Proses edit tentang kami
exports.postEditTentangKami = async (req, res) => {
    try {
        const id = req.params.id;
        const { judul, jenis, konten, status } = req.body;
        
        // Ambil data lama
        const oldData = await TentangKami.findById(id);
        if (!oldData) {
            req.flash('error', 'Data tentang kami tidak ditemukan');
            return res.redirect('/admin/tentangkami');
        }
        
        let gambar = oldData.gambar;

        // Proses upload gambar baru jika ada
        if (req.files && req.files.gambar) {
            // Hapus gambar lama jika ada
            if (oldData.gambar) {
                deleteFile(`public${oldData.gambar}`);
            }
            
            const gambarFile = req.files.gambar;
            const gambarFileName = `tentangkami_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/tentangkami/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'tentangkami');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Update data
        await TentangKami.update(id, {
            judul,
            jenis,
            konten,
            gambar,
            status,
            updated_by: req.user.id
        });

        req.flash('success', 'Data tentang kami berhasil diperbarui');
        res.redirect('/admin/tentangkami');
    } catch (error) {
        console.error('Error in postEditTentangKami:', error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui data tentang kami');
        res.redirect(`/admin/tentangkami/edit/${req.params.id}`);
    }
};

// Proses hapus tentang kami
exports.deleteTentangKami = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Ambil data untuk menghapus file terkait
        const tentangKami = await TentangKami.findById(id);
        if (!tentangKami) {
            return res.status(404).json({ success: false, message: 'Data tentang kami tidak ditemukan' });
        }
        
        // Hapus file gambar jika ada
        if (tentangKami.gambar) {
            deleteFile(`public${tentangKami.gambar}`);
        }
        
        // Hapus data dari database
        await TentangKami.delete(id);
        
        res.json({ success: true, message: 'Data tentang kami berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteTentangKami:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data tentang kami' });
    }
};

// ===== GALERI =====

// Menampilkan daftar galeri
exports.getGaleri = async (req, res) => {
    try {
        const galeri = await Galeri.findAll();
        res.render('admin/galeri/index', {
            title: 'Kelola Galeri',
            galeri,
            user: req.user,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getGaleri:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data galeri');
        res.redirect('/admin/dashboard');
    }
};

// Menampilkan form tambah galeri
exports.getTambahGaleri = (req, res) => {
    res.render('admin/galeri/tambah', {
        title: 'Tambah Galeri',
        user: req.user,
        error_msg: req.flash('error')
    });
};

// Proses tambah galeri
exports.postTambahGaleri = async (req, res) => {
    try {
        const { judul, deskripsi, kategori, tanggal, is_published } = req.body;
        let gambar = null;

        // Proses upload gambar jika ada
        if (req.files && req.files.gambar) {
            const gambarFile = req.files.gambar;
            const gambarFileName = `galeri_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/galeri/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'galeri');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Simpan ke database
        await Galeri.create({
            judul,
            deskripsi,
            gambar,
            kategori,
            tanggal,
            is_published: is_published === 'on' ? 1 : 0,
            uploaded_by: req.user.id
        });

        req.flash('success', 'Data galeri berhasil ditambahkan');
        res.redirect('/admin/galeri');
    } catch (error) {
        console.error('Error in postTambahGaleri:', error);
        req.flash('error', 'Terjadi kesalahan saat menambahkan data galeri');
        res.redirect('/admin/galeri/tambah');
    }
};

// Menampilkan form edit galeri
exports.getEditGaleri = async (req, res) => {
    try {
        const id = req.params.id;
        const galeri = await Galeri.findById(id);
        
        if (!galeri) {
            req.flash('error', 'Data galeri tidak ditemukan');
            return res.redirect('/admin/galeri');
        }
        
        res.render('admin/galeri/edit', {
            title: 'Edit Galeri',
            galeri,
            user: req.user,
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getEditGaleri:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data galeri');
        res.redirect('/admin/galeri');
    }
};

// Proses edit galeri
exports.postEditGaleri = async (req, res) => {
    try {
        const id = req.params.id;
        const { judul, deskripsi, kategori, tanggal, is_published } = req.body;
        
        // Ambil data lama
        const oldData = await Galeri.findById(id);
        if (!oldData) {
            req.flash('error', 'Data galeri tidak ditemukan');
            return res.redirect('/admin/galeri');
        }
        
        let gambar = oldData.gambar;

        // Proses upload gambar baru jika ada
        if (req.files && req.files.gambar) {
            // Hapus gambar lama jika ada
            if (oldData.gambar) {
                deleteFile(`public${oldData.gambar}`);
            }
            
            const gambarFile = req.files.gambar;
            const gambarFileName = `galeri_${Date.now()}_${gambarFile.name}`;
            const gambarPath = `/uploads/galeri/${gambarFileName}`;
            
            // Pastikan direktori ada
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'galeri');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Pindahkan file
            await gambarFile.mv(path.join(uploadDir, gambarFileName));
            gambar = gambarPath;
        }

        // Update data
        await Galeri.update(id, {
            judul,
            deskripsi,
            gambar,
            kategori,
            tanggal,
            is_published: is_published === 'on' ? 1 : 0,
            updated_by: req.user.id
        });

        req.flash('success', 'Data galeri berhasil diperbarui');
        res.redirect('/admin/galeri');
    } catch (error) {
        console.error('Error in postEditGaleri:', error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui data galeri');
        res.redirect(`/admin/galeri/edit/${req.params.id}`);
    }
};

// Proses hapus galeri
exports.deleteGaleri = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Ambil data untuk menghapus file terkait
        const galeri = await Galeri.findById(id);
        if (!galeri) {
            return res.status(404).json({ success: false, message: 'Data galeri tidak ditemukan' });
        }
        
        // Hapus file gambar jika ada
        if (galeri.gambar) {
            deleteFile(`public${galeri.gambar}`);
        }
        
        // Hapus data dari database
        await Galeri.delete(id);
        
        res.json({ success: true, message: 'Data galeri berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteGaleri:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data galeri' });
    }
};

// ===== KONTAK =====

// Menampilkan daftar kontak
exports.getKontak = async (req, res) => {
    try {
        const kontak = await Kontak.findAll();
        res.render('admin/kontak/index', {
            title: 'Kelola Kontak',
            kontak,
            user: req.user,
            error_msg: req.flash('error'),
            success_msg: req.flash('success')
        });
    } catch (error) {
        console.error('Error in getKontak:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data kontak');
        res.redirect('/admin/dashboard');
    }
};

// Menampilkan detail kontak
exports.getDetailKontak = async (req, res) => {
    try {
        const id = req.params.id;
        const kontak = await Kontak.findById(id);
        
        if (!kontak) {
            req.flash('error', 'Data kontak tidak ditemukan');
            return res.redirect('/admin/kontak');
        }
        
        res.render('admin/kontak/detail', {
            title: 'Detail Kontak',
            kontak,
            user: req.user,
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getDetailKontak:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat detail kontak');
        res.redirect('/admin/kontak');
    }
};

// Proses update status kontak
exports.postUpdateKontak = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, catatan } = req.body;
        
        await Kontak.update(id, { status, catatan });

        req.flash('success', 'Status kontak berhasil diperbarui');
        res.redirect('/admin/kontak');
    } catch (error) {
        console.error('Error in postUpdateKontak:', error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui status kontak');
        res.redirect(`/admin/kontak/detail/${req.params.id}`);
    }
};

// Proses hapus kontak
exports.deleteKontak = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Hapus data dari database
        await Kontak.delete(id);
        
        res.json({ success: true, message: 'Data kontak berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteKontak:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data kontak' });
    }
};