const {
    Barang,
    Peminjaman,
    DetailPeminjaman,
    LaporanMasalah,
    User,
} = require("../models");

const { Op } = require("sequelize");

const getYearRange = (tahun) => {
    const year = parseInt(tahun, 10) || new Date().getFullYear();

    return {
        tahun: year,
        startOfYear: new Date(year, 0, 1, 0, 0, 0, 0),
        endOfYear: new Date(year, 11, 31, 23, 59, 59, 999),
    };
};

const getNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isNaN(number) ? fallback : number;
};

const dataanalitikController = {
    getPengadaanAnalytics: async (req, res) => {
        try {
            const { tahun, startOfYear, endOfYear } = getYearRange(req.query.tahun);

            const semuaBarang = await Barang.findAll({
                attributes: ["id", "nama_barang", "stok"],
                order: [["nama_barang", "ASC"]],
            });

            let totalPengguna = 0;

            try {
                totalPengguna = await User.count({
                    where: {
                        level_akses: "peminjam",
                    },
                });
            } catch (err) {
                totalPengguna = await User.count();
            }

            const peminjamanTahunIni = await Peminjaman.findAll({
                where: {
                    tanggal_pinjam: {
                        [Op.between]: [startOfYear, endOfYear],
                    },
                    status: {
                        [Op.notIn]: ["Ditolak"],
                    },
                },
                attributes: ["id"],
            });

            const peminjamanIds = peminjamanTahunIni.map((p) => p.id);

            let detailPeminjamanTahunIni = [];

            if (peminjamanIds.length > 0) {
                detailPeminjamanTahunIni = await DetailPeminjaman.findAll({
                    where: {
                        peminjaman_id: {
                            [Op.in]: peminjamanIds,
                        },
                    },
                    attributes: ["barang_id", "jumlah_pinjam"],
                });
            }

            const laporanTahunIni = await LaporanMasalah.findAll({
                where: {
                    tanggal_kejadian: {
                        [Op.between]: [startOfYear, endOfYear],
                    },
                },
                attributes: ["barang_id", "jenis_laporan", "status", "jumlah"],
            });

            const hasilAnalitik = semuaBarang.map((barang) => {
                const transaksiBarangIni = detailPeminjamanTahunIni.filter(
                    (detail) => Number(detail.barang_id) === Number(barang.id)
                );

                const laporanBarangIni = laporanTahunIni.filter(
                    (laporan) => Number(laporan.barang_id) === Number(barang.id)
                );

                let total_dipinjam = 0;
                let jumlah_rusak = 0;
                let jumlah_hilang = 0;
                let jumlah_rusak_total = 0;

                transaksiBarangIni.forEach((transaksi) => {
                    total_dipinjam += getNumber(transaksi.jumlah_pinjam, 1);
                });

                laporanBarangIni.forEach((laporan) => {
                    const jumlah = getNumber(laporan.jumlah, 1);
                    const jenisLaporan = String(laporan.jenis_laporan || "").toLowerCase();
                    const status = String(laporan.status || "").toLowerCase();

                    if (status === "rusak total") {
                        jumlah_rusak_total += jumlah;
                    } else if (jenisLaporan === "kerusakan") {
                        jumlah_rusak += jumlah;
                    } else if (jenisLaporan === "kehilangan") {
                        jumlah_hilang += jumlah;
                    }
                });

                return {
                    id: barang.id,
                    kode: `BRG-${barang.id}`,
                    nama: barang.nama_barang || "Tanpa Nama",
                    stok_saat_ini: getNumber(barang.stok, 0),
                    total_dipinjam,
                    rusak: jumlah_rusak,
                    hilang: jumlah_hilang,
                    rusak_total: jumlah_rusak_total,
                };
            });

            hasilAnalitik.sort((a, b) => {
                if (b.total_dipinjam !== a.total_dipinjam) {
                    return b.total_dipinjam - a.total_dipinjam;
                }

                const kendalaB = b.rusak + b.hilang + b.rusak_total;
                const kendalaA = a.rusak + a.hilang + a.rusak_total;

                return kendalaB - kendalaA;
            });

            return res.status(200).json({
                status: "success",
                message: `Data analitik pengadaan tahun ${tahun} berhasil diambil.`,
                total_user: totalPengguna,
                data: hasilAnalitik,
            });
        } catch (error) {
            console.error("❌ CRASH DI ANALITIK CONTROLLER:", error);

            return res.status(500).json({
                status: "error",
                message: "Gagal memuat data analitik pengadaan.",
                error: error.message,
            });
        }
    },

    getPeminjamanBulanan: async (req, res) => {
        try {
            const { tahun, startOfYear, endOfYear } = getYearRange(req.query.tahun);

            const peminjamanTahunIni = await Peminjaman.findAll({
                where: {
                    tanggal_pinjam: {
                        [Op.between]: [startOfYear, endOfYear],
                    },
                    status: {
                        [Op.notIn]: ["Ditolak"],
                    },
                },
                attributes: ["id", "tanggal_pinjam"],
                order: [["tanggal_pinjam", "ASC"]],
            });

            const namaBulan = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];

            const monthlyTotals = Array.from({ length: 12 }, (_, index) => ({
                bulan: index + 1,
                nama_bulan: namaBulan[index],
                total: 0,
            }));

            peminjamanTahunIni.forEach((peminjaman) => {
                if (!peminjaman.tanggal_pinjam) return;

                const tanggal = new Date(peminjaman.tanggal_pinjam);
                const bulanIndex = tanggal.getMonth();

                if (bulanIndex >= 0 && bulanIndex <= 11) {
                    monthlyTotals[bulanIndex].total += 1;
                }
            });

            return res.status(200).json({
                status: "success",
                message: `Tren peminjaman bulanan tahun ${tahun} berhasil diambil.`,
                data: monthlyTotals,
            });
        } catch (error) {
            console.error("❌ CRASH DI PEMINJAMAN BULANAN:", error);

            return res.status(500).json({
                status: "error",
                message: "Gagal memuat tren peminjaman bulanan.",
                error: error.message,
            });
        }
    },
};

module.exports = dataanalitikController;