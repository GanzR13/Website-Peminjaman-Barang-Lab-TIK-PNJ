'use strict';

const { LaporanMasalah, Barang, Peminjaman } = require('../models');

// 1. Fungsi Membuat Laporan Baru
exports.buatLaporan = async (req, res) => {
    try {
        const { peminjaman_id, barang_id, jenis_laporan, jumlah, deskripsi, tanggal_kejadian } = req.body;
        
        // Tangkap URL gambar WEBP dari Cloudinary hasil middleware
        const foto_bukti = req.file ? req.file.path : null; 

        // Validasi input wajib
        if (!barang_id || !jenis_laporan || !deskripsi || !tanggal_kejadian) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Data wajib seperti barang, jenis laporan, deskripsi, dan tanggal kejadian harus diisi.' 
            });
        }

        // Simpan data ke Database
        const laporanBaru = await LaporanMasalah.create({
            pelapor_id: req.user.id,
            peminjaman_id: peminjaman_id || null, // Null jika lapor barang rusak di luar peminjaman
            barang_id,
            jenis_laporan,
            jumlah: jumlah || 1,
            deskripsi,
            tanggal_kejadian,
            foto_bukti: foto_bukti, // Menyimpan URL Cloudinary
            status: "Menunggu Tindakan"
        });

        res.status(201).json({
            status: 'success',
            message: `Laporan ${jenis_laporan} berhasil dikirim dan sedang menunggu tinjauan Admin.`,
            data: laporanBaru
        });

    } catch (error) {
        console.error("Error buat laporan masalah:", error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server saat menyimpan laporan.' });
    }
};

// 2. Fungsi Mengambil Semua Riwayat Laporan Milik Mahasiswa Terkait
exports.getRiwayatLaporan = async (req, res) => {
    try {
        const laporanSaya = await LaporanMasalah.findAll({
            where: { pelapor_id: req.user.id },
            include: [
                { 
                    model: Barang, 
                    as: 'barang', 
                    attributes: ['nama_barang', 'id', 'gambar'] 
                },
                {
                    model: Peminjaman,
                    as: 'peminjaman',
                    attributes: ['tujuan_peminjaman', 'tanggal_pinjam']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ status: 'success', data: laporanSaya });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 3. Fungsi Mengambil Detail Satu Laporan Spesifik
exports.getDetailLaporan = async (req, res) => {
    try {
        const laporan = await LaporanMasalah.findOne({
            where: { 
                id: req.params.id,
                pelapor_id: req.user.id // Keamanan ekstra: mahasiswa cuma bisa lihat laporannya sendiri
            },
            include: [
                { 
                    model: Barang, 
                    as: 'barang', 
                    attributes: ['nama_barang', 'id', 'gambar'] 
                },
                {
                    model: Peminjaman,
                    as: 'peminjaman',
                    attributes: ['tujuan_peminjaman', 'tanggal_pinjam', 'tanggal_kembali']
                }
            ]
        });

        if (!laporan) {
            return res.status(404).json({ status: 'error', message: 'Laporan tidak ditemukan atau Anda tidak memiliki akses.' });
        }

        res.status(200).json({ status: 'success', data: laporan });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};