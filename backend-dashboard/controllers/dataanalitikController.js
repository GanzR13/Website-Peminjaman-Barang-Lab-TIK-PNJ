const {
    Barang,
    Peminjaman,
    DetailPeminjaman,
    LaporanMasalah,
    User, // <-- PERBAIKAN 1: Tambahkan User agar tidak crash
} = require("../models"); 
const { Op } = require("sequelize");

const dataanalitikController = {
    getPengadaanAnalytics: async (req, res) => {
        try {
            const tahun = parseInt(req.query.tahun) || new Date().getFullYear();

            // Rentang waktu 1 Januari - 31 Desember
            const startOfYear = new Date(`${tahun}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${tahun}-12-31T23:59:59.999Z`);

            // LANGKAH 1: Ambil SEMUA data barang sebagai dasar
            const semuaBarang = await Barang.findAll();
            
            // Hitung total pengguna
            const totalPengguna = await User.count();

            // LANGKAH 2: Cari Peminjaman di tahun tersebut SECARA TERPISAH (Tanpa Include)
            let peminjamanTahunIni = [];
            if (Peminjaman) {
                peminjamanTahunIni = await Peminjaman.findAll({
                    where: {
                        tanggal_pinjam: {
                            [Op.between]: [startOfYear, endOfYear],
                        },
                        status: {
                            [Op.notIn]: ["Ditolak"],
                        },
                    },
                    attributes: ["id"], // Hanya ambil ID untuk menghemat memori
                });
            }

            const peminjamanIds = peminjamanTahunIni.map((p) => p.id);

            // LANGKAH 3: Tarik Detail Peminjaman berdasarkan kumpulan ID di atas
            let detailPeminjamanTahunIni = [];
            if (DetailPeminjaman && peminjamanIds.length > 0) {
                detailPeminjamanTahunIni = await DetailPeminjaman.findAll({
                    where: {
                        peminjaman_id: {
                            [Op.in]: peminjamanIds,
                        },
                    },
                });
            }

            // LANGKAH 4: Tarik data Laporan Masalah (Kerusakan & Kehilangan) di tahun tersebut
            let laporanTahunIni = [];
            if (LaporanMasalah) {
                laporanTahunIni = await LaporanMasalah.findAll({
                    where: {
                        tanggal_kejadian: {
                            [Op.between]: [startOfYear, endOfYear],
                        },
                    },
                });
            }

            // LANGKAH 5: Proses Descriptive Analytics dengan Logika Array Javascript
            const hasilAnalitik = semuaBarang.map((barang) => {
                // Filter data spesifik untuk barang ini
                const transaksiBarangIni = detailPeminjamanTahunIni.filter(
                    (detail) => detail.barang_id === barang.id,
                );
                const laporanBarangIni = laporanTahunIni.filter(
                    (laporan) => laporan.barang_id === barang.id,
                );

                let total_dipinjam = 0;
                let jumlah_rusak = 0;
                let jumlah_hilang = 0;
                let jumlah_rusak_total = 0; // <-- PERBAIKAN 3: Siapkan variabel afkir

                // Hitung total dipinjam dari detail_peminjaman
                transaksiBarangIni.forEach((transaksi) => {
                    total_dipinjam += transaksi.jumlah_pinjam || 1;
                });

                // Hitung kerusakan, kehilangan, dan rusak total dari tabel laporan_masalah
                laporanBarangIni.forEach((laporan) => {
                    // Cek Rusak Total terlebih dahulu agar tidak double hitung dengan Kerusakan biasa
                    if (laporan.status === "Rusak Total") {
                        jumlah_rusak_total += laporan.jumlah || 1;
                    } else if (laporan.jenis_laporan === "Kerusakan") {
                        jumlah_rusak += laporan.jumlah || 1;
                    } else if (laporan.jenis_laporan === "Kehilangan") {
                        jumlah_hilang += laporan.jumlah || 1;
                    }
                });

                return {
                    id: barang.id,
                    kode: barang.kode_barang || `BRG-${barang.id}`,
                    nama: barang.nama_barang,
                    stok_saat_ini: barang.stok,
                    total_dipinjam: total_dipinjam,
                    rusak: jumlah_rusak,
                    hilang: jumlah_hilang, 
                    rusak_total: jumlah_rusak_total // <-- Kirim ke Vue
                };
            });

            // Urutkan dari yang paling sering dipinjam
            hasilAnalitik.sort((a, b) => b.total_dipinjam - a.total_dipinjam);

            // PERBAIKAN 2: Hanya gunakan SATU buah blok return agar total_user terkirim
            return res.status(200).json({
                status: "success",
                total_user: totalPengguna, // <-- Berhasil dikirim ke Dashboard.vue
                data: hasilAnalitik,
            });

        } catch (error) {
            console.error("❌ CRASH DI ANALITIK CONTROLLER:", error);
            return res.status(500).json({ status: "error", message: error.message });
        }
    },
};

module.exports = dataanalitikController;