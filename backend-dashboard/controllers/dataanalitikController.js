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
            const limit = parseInt(req.query.limit, 10) || null;

            const semuaBarang = await Barang.findAll({
                attributes: ["id", "nama_barang", "stok"],
                order: [["nama_barang", "ASC"]],
            });

            let totalPengguna = 0;
            try {
                totalPengguna = await User.count({ where: { level_akses: "peminjam" } });
            } catch (err) {
                totalPengguna = await User.count();
            }

            const peminjamanTahunIni = await Peminjaman.findAll({
                where: {
                    tanggal_pinjam: { [Op.between]: [startOfYear, endOfYear] },
                    status: { [Op.notIn]: ["Ditolak"] },
                },
                attributes: ["id"],
            });

            const peminjamanIds = peminjamanTahunIni.map((p) => p.id);
            let detailPeminjamanTahunIni = [];

            if (peminjamanIds.length > 0) {
                detailPeminjamanTahunIni = await DetailPeminjaman.findAll({
                    where: { peminjaman_id: { [Op.in]: peminjamanIds } },
                    attributes: ["barang_id", "jumlah_pinjam"],
                });
            }

            const laporanTahunIni = await LaporanMasalah.findAll({
                where: {
                    tanggal_kejadian: { [Op.between]: [startOfYear, endOfYear] },
                },
                attributes: ["barang_id", "jenis_laporan", "status", "jumlah"],
            });

            let hasilAnalitik = semuaBarang.map((barang) => {
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

                const stok_saat_ini = getNumber(barang.stok, 0);

                // --- 1. UPGRADE DIAGNOSTIC: UTILISASI VS TARGET ---
                // Asumsi Target: 1 unit barang idealnya dipinjam minimal 1x per bulan (12x setahun)
                const target_pemakaian_tahunan = Math.max(stok_saat_ini * 12, 12);
                const rasio_utilisasi = Math.round((total_dipinjam / target_pemakaian_tahunan) * 100);
                
                let status_utilisasi = "Normal (Optimal)";
                if (rasio_utilisasi > 85) {
                    status_utilisasi = "Overload (Melebihi Target Kapasitas)";
                } else if (rasio_utilisasi < 20 && stok_saat_ini > 0) {
                    status_utilisasi = "Underutilized (Jarang Dipakai)";
                }

                // --- 2. UPGRADE PREDICTIVE: PROYEKSI KEBUTUHAN TAHUN DEPAN ---
                // Menghitung tingkat keausan/kerusakan (Wear & Tear Rate)
                const total_kendala = jumlah_rusak + jumlah_hilang + jumlah_rusak_total;
                const wear_and_tear_rate = total_dipinjam > 0 ? (total_kendala / total_dipinjam) : 0;
                
                // Proyeksi kenaikan aktivitas laboratorium 10% di tahun depan
                const proyeksi_peminjaman_depan = Math.round(total_dipinjam * 1.1);
                const prediksi_kendala_depan = Math.ceil(proyeksi_peminjaman_depan * wear_and_tear_rate);
                
                // Estimasi berapa stok baru yang harus dibeli agar lab tidak defisit
                const defisit_stok = (stok_saat_ini - total_kendala);
                const estimasi_kebutuhan_depan = defisit_stok < 5 ? (5 - defisit_stok) + prediksi_kendala_depan : 0;

                return {
                    id: barang.id,
                    kode: `BRG-${barang.id}`,
                    nama: barang.nama_barang || "Tanpa Nama",
                    stok_saat_ini,
                    total_dipinjam,
                    rusak: jumlah_rusak,
                    hilang: jumlah_hilang,
                    rusak_total: jumlah_rusak_total,
                    // Field analitik baru untuk UI:
                    analitik_utilisasi: {
                        rasio_persen: rasio_utilisasi,
                        target_tahunan: target_pemakaian_tahunan,
                        status: status_utilisasi
                    },
                    analitik_prediktif: {
                        proyeksi_peminjaman_depan,
                        prediksi_kendala_depan,
                        estimasi_kebutuhan_stok: estimasi_kebutuhan_depan
                    }
                };
            });

            // Sorting dari yang paling banyak dipinjam
            hasilAnalitik.sort((a, b) => {
                if (b.total_dipinjam !== a.total_dipinjam) {
                    return b.total_dipinjam - a.total_dipinjam;
                }
                const kendalaB = b.rusak + b.hilang + b.rusak_total;
                const kendalaA = a.rusak + a.hilang + a.rusak_total;
                return kendalaB - kendalaA;
            });

            if (limit && limit > 0) {
                hasilAnalitik = hasilAnalitik.slice(0, limit);
            }

            return res.status(200).json({
                status: "success",
                message: `Data analitik pengadaan tahun ${tahun} berhasil diambil.`,
                total_user: totalPengguna,
                data: hasilAnalitik,
            });
        } catch (error) {
            console.error("Crash di analitik controller:", error);
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
                    tanggal_pinjam: { [Op.between]: [startOfYear, endOfYear] },
                    status: { [Op.notIn]: ["Ditolak"] },
                },
                attributes: ["id", "tanggal_pinjam"],
                order: [["tanggal_pinjam", "ASC"]],
            });

            const namaBulan = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember",
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
            console.error("Crash di peminjaman bulanan:", error);
            return res.status(500).json({
                status: "error",
                message: "Gagal memuat tren peminjaman bulanan.",
                error: error.message,
            });
        }
    },

    // --- 3. FITUR BARU: DIAGNOSTIC & DRILL-DOWN ENDPOINT ---
    // Dipanggil saat dosen / user meng-klik salah satu barang untuk membedah akar masalahnya
    getDiagnosaBarang: async (req, res) => {
        try {
            const barangId = parseInt(req.params.id, 10);
            const { tahun, startOfYear, endOfYear } = getYearRange(req.query.tahun);

            if (!barangId) {
                return res.status(400).json({ status: "error", message: "ID Barang tidak valid." });
            }

            const barang = await Barang.findByPk(barangId, {
                attributes: ["id", "nama_barang", "stok"]
            });

            if (!barang) {
                return res.status(404).json({ status: "error", message: "Barang tidak ditemukan." });
            }

            // Cari semua transaksi peminjaman untuk barang ini di tahun terpilih
            const detailPeminjaman = await DetailPeminjaman.findAll({
                where: { barang_id: barangId },
                attributes: ["peminjaman_id", "jumlah_pinjam"]
            });

            const peminjamanIds = detailPeminjaman.map(d => d.peminjaman_id);
            let riwayatPeminjaman = [];
            let distribusiBulanan = Array(12).fill(0);

            if (peminjamanIds.length > 0) {
                riwayatPeminjaman = await Peminjaman.findAll({
                    where: {
                        id: { [Op.in]: peminjamanIds },
                        tanggal_pinjam: { [Op.between]: [startOfYear, endOfYear] },
                        status: { [Op.notIn]: ["Ditolak"] }
                    },
                    attributes: ["id", "tanggal_pinjam", "status"]
                });

                // Hitung tren peminjaman bulanan khusus untuk barang ini
                riwayatPeminjaman.forEach(p => {
                    const bulan = new Date(p.tanggal_pinjam).getMonth();
                    distribusiBulanan[bulan] += 1;
                });
            }

            // PERBAIKAN DI SINI:
            // Kolom "keterangan" sudah dihapus agar tidak memicu error 42703 di database!
            const daftarKendala = await LaporanMasalah.findAll({
                where: {
                    barang_id: barangId,
                    tanggal_kejadian: { [Op.between]: [startOfYear, endOfYear] }
                },
                attributes: ["id", "tanggal_kejadian", "jenis_laporan", "status", "jumlah"],
                order: [["tanggal_kejadian", "DESC"]]
            });

            // Kesimpulan Diagnostik Otomatis (Akar Masalah)
            const puncakBulanIdx = distribusiBulanan.indexOf(Math.max(...distribusiBulanan));
            const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            
            let kesimpulan_diagnosa = "Barang dalam kondisi baik dan pola peminjaman stabil.";
            if (daftarKendala.length > 0) {
                kesimpulan_diagnosa = `Terdapat ${daftarKendala.length} laporan insiden pada tahun ${tahun}. Puncak pemakaian terjadi pada bulan ${namaBulan[puncakBulanIdx]}, yang berkolerasi dengan peningkatan risiko kerusakan alat.`;
            }

            return res.status(200).json({
                status: "success",
                message: `Diagnosa analitik untuk barang ${barang.nama_barang} berhasil diproses.`,
                data: {
                    info_barang: {
                        id: barang.id,
                        nama: barang.nama_barang,
                        stok: getNumber(barang.stok, 0)
                    },
                    metrik_diagnostik: {
                        total_transaksi_tahun_ini: riwayatPeminjaman.length,
                        puncak_aktivitas_bulan: namaBulan[puncakBulanIdx],
                        total_laporan_kendala: daftarKendala.length,
                        kesimpulan_sistem: kesimpulan_diagnosa
                    },
                    distribusi_peminjaman_bulanan: distribusiBulanan,
                    riwayat_kendala: daftarKendala
                }
            });

        } catch (error) {
            console.error("Crash di diagnosa barang:", error);
            return res.status(500).json({
                status: "error",
                message: "Gagal memuat diagnosa barang.",
                error: error.message,
            });
        }
    }
};

module.exports = dataanalitikController;