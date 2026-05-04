"use strict";

const { Peminjaman, DetailPeminjaman, Barang, User, Mahasiswa, Pegawai, sequelize } = require("../models");
const { Op } = require("sequelize");

// ==========================================
// FUNGSI ADMIN: AMBIL SEMUA DATA + PAGINASI
// ==========================================
exports.getAllPeminjaman = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Peminjaman.findAndCountAll({
            limit: limit,
            offset: offset,
            distinct: true, 
            include: [
                { 
                    model: User, 
                    as: 'peminjam', 
                    // PERBAIKAN 1: Hapus nama_lengkap dari sini karena tidak ada di tabel User
                    attributes: ['id', 'email'], 
                    include: [
                        { model: Mahasiswa, as: 'mahasiswa' },
                        { model: Pegawai, as: 'pegawai' }
                    ]
                },
                {
                    model: DetailPeminjaman,
                    as: 'detail_barang',
                    include: [{ model: Barang, as: 'barang' }]
                }
            ],
            order: [
                ['createdAt', 'ASC'], 
                ['antrian', 'ASC']
            ]
        });

        // PERBAIKAN 2: Logika Mapping Nama Disesuaikan dengan Struktur Tabel
        const mappedData = rows.map(item => {
            const plain = item.get({ plain: true });
            
            let namaAsli = 'User Terhapus';
            
            if (plain.peminjam) {
                // Skenario 1: Jika MAHASISWA
                if (plain.peminjam.mahasiswa) {
                    namaAsli = plain.peminjam.mahasiswa.nama_mahasiswa 
                            || plain.peminjam.mahasiswa.nama;
                } 
                // Skenario 2: Jika PEGAWAI / DOSEN
                else if (plain.peminjam.pegawai) {
                    // Panggil nama_lengkap dari dalam objek pegawai
                    namaAsli = plain.peminjam.pegawai.nama_lengkap 
                            || plain.peminjam.pegawai.nama_pegawai 
                            || plain.peminjam.pegawai.nama;
                }

                // Skenario Terakhir: Validasi kosong & Fallback ke Email
                if (!namaAsli || String(namaAsli).trim() === '') {
                    namaAsli = plain.peminjam.email || `User ID: ${plain.user_id}`;
                }
            }

            return {
                ...plain,
                nama_peminjam: namaAsli
            };
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({ 
            status: "success", 
            data: mappedData,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error("Error Admin GetAllPeminjaman:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ==========================================
// FUNGSI ADMIN: UPDATE STATUS (SETUJUI/TOLAK/SELESAI)
// ==========================================
exports.updateStatusPeminjaman = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, catatan_admin } = req.body;

        const peminjaman = await Peminjaman.findByPk(id, {
            include: [{ model: DetailPeminjaman, as: 'detail_barang' }],
            transaction: t
        });

        if (!peminjaman) {
            await t.rollback();
            return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
        }

        const statusSaatIni = peminjaman.status;
        const statusSudahKembali = ['Ditolak', 'Dibatalkan', 'Selesai'];

        // Jika status baru ditolak/batal/selesai, dan status sebelumnya BUKAN ditolak/batal/selesai
        if (['Ditolak', 'Dibatalkan', 'Selesai'].includes(status) && !statusSudahKembali.includes(statusSaatIni)) {
            if (peminjaman.detail_barang && peminjaman.detail_barang.length > 0) {
                for (const item of peminjaman.detail_barang) {
                    await Barang.increment('stok', { 
                        by: item.jumlah_pinjam, 
                        where: { id: item.barang_id }, 
                        transaction: t 
                    });
                }
            }
        }

        // Update status dan catatan
        await peminjaman.update({ 
            status: status,
            catatan_admin: catatan_admin || peminjaman.catatan_admin 
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ 
            status: "success", 
            message: `Peminjaman berhasil diubah menjadi: ${status}` 
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Error Update Status:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};