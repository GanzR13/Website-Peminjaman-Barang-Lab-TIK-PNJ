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
                attributes: ["id", "nama_barang", "stok", "id_kategori"],
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
                    // PERBAIKAN: Menghapus "Dibatalkan" agar tidak error ENUM PostgreSQL
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
                const isBHP = barang.id_kategori === 1;

                let rasio_utilisasi = 0;
                let status_utilisasi = "";
                let estimasi_kebutuhan_depan = 0;
                const proyeksi_peminjaman_depan = Math.round(total_dipinjam * 1.1);

                if (isBHP) {
                    const rata_rata_bulanan = Math.ceil(total_dipinjam / 12);
                    const minimum_stok_aman = rata_rata_bulanan * 3;
                    
                    const total_historis = stok_saat_ini + total_dipinjam;
                    rasio_utilisasi = total_historis > 0 ? Math.round((total_dipinjam / total_historis) * 100) : 0;

                    if (stok_saat_ini === 0) {
                        status_utilisasi = "Habis Total (Kritis)";
                    } else if (stok_saat_ini <= minimum_stok_aman) {
                        status_utilisasi = "Kritis (Butuh Restock)";
                    } else {
                        status_utilisasi = "Aman (Stok Mencukupi)";
                    }

                    const proyeksi_total_kebutuhan = proyeksi_peminjaman_depan + minimum_stok_aman;
                    estimasi_kebutuhan_depan = Math.max(proyeksi_total_kebutuhan - stok_saat_ini, 0);

                } else {
                    const target_pemakaian_tahunan = Math.max(stok_saat_ini * 12, 12);
                    rasio_utilisasi = Math.round((total_dipinjam / target_pemakaian_tahunan) * 100);
                    
                    if (rasio_utilisasi > 85) {
                        status_utilisasi = "Overload (Melebihi Target Kapasitas)";
                    } else if (rasio_utilisasi < 20 && stok_saat_ini > 0) {
                        status_utilisasi = "Underutilized (Jarang Dipakai)";
                    } else {
                        status_utilisasi = "Normal (Optimal)";
                    }

                    const total_kendala = jumlah_rusak + jumlah_hilang + jumlah_rusak_total;
                    const wear_and_tear_rate = total_dipinjam > 0 ? (total_kendala / total_dipinjam) : 0;
                    
                    const prediksi_kendala_depan = Math.ceil(proyeksi_peminjaman_depan * wear_and_tear_rate);
                    
                    const defisit_stok = (stok_saat_ini - total_kendala);
                    estimasi_kebutuhan_depan = defisit_stok < 5 ? Math.max(5 - defisit_stok, 0) + prediksi_kendala_depan : prediksi_kendala_depan;
                }

                return {
                    id: barang.id,
                    kode: `BRG-${barang.id}`,
                    nama: barang.nama_barang || "Tanpa Nama",
                    kategori: isBHP ? "BHP" : "Alat",
                    stok_saat_ini,
                    total_dipinjam,
                    rusak: jumlah_rusak,
                    hilang: jumlah_hilang,
                    rusak_total: jumlah_rusak_total,
                    
                    analitik_utilisasi: {
                        rasio_persen: rasio_utilisasi,
                        status: status_utilisasi
                    },
                    analitik_prediktif: {
                        proyeksi_peminjaman_depan,
                        estimasi_kebutuhan_stok: estimasi_kebutuhan_depan
                    }
                };
            });

            hasilAnalitik.sort((a, b) => {
                return b.analitik_prediktif.estimasi_kebutuhan_stok - a.analitik_prediktif.estimasi_kebutuhan_stok;
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
                    // PERBAIKAN: Menghapus "Dibatalkan"
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

    getDiagnosaBarang: async (req, res) => {
        try {
            const barangId = parseInt(req.params.id, 10);
            const { tahun, startOfYear, endOfYear } = getYearRange(req.query.tahun);

            if (!barangId) {
                return res.status(400).json({ status: "error", message: "ID Barang tidak valid." });
            }

            const barang = await Barang.findByPk(barangId, {
                attributes: ["id", "nama_barang", "stok", "id_kategori"]
            });

            if (!barang) {
                return res.status(404).json({ status: "error", message: "Barang tidak ditemukan." });
            }

            const isBHP = barang.id_kategori === 1;

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
                        // PERBAIKAN: Menghapus "Dibatalkan"
                        status: { [Op.notIn]: ["Ditolak"] }
                    },
                    attributes: ["id", "tanggal_pinjam", "status"]
                });

                riwayatPeminjaman.forEach(p => {
                    const bulan = new Date(p.tanggal_pinjam).getMonth();
                    distribusiBulanan[bulan] += 1;
                });
            }

            const daftarKendala = await LaporanMasalah.findAll({
                where: {
                    barang_id: barangId,
                    tanggal_kejadian: { [Op.between]: [startOfYear, endOfYear] }
                },
                attributes: ["id", "tanggal_kejadian", "jenis_laporan", "status", "jumlah"],
                order: [["tanggal_kejadian", "DESC"]]
            });

            const puncakBulanIdx = distribusiBulanan.indexOf(Math.max(...distribusiBulanan));
            const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            
            let kesimpulan_diagnosa = "Aktivitas barang relatif stabil.";
            
            if (isBHP) {
                kesimpulan_diagnosa = `Tingkat konsumsi BHP ini memuncak pada bulan ${namaBulan[puncakBulanIdx]}. Pastikan stok di bulan-bulan tersebut selalu diamankan lebih awal.`;
                if (getNumber(barang.stok, 0) < 10) {
                    kesimpulan_diagnosa += " Peringatan: Stok saat ini sudah sangat menipis.";
                }
            } else {
                if (daftarKendala.length > 0) {
                    kesimpulan_diagnosa = `Terdapat ${daftarKendala.length} laporan insiden kerusakan/kehilangan pada tahun ${tahun}. Puncak pemakaian terjadi pada bulan ${namaBulan[puncakBulanIdx]}, yang berkorelasi dengan peningkatan risiko penyusutan alat.`;
                } else {
                    kesimpulan_diagnosa = `Kondisi alat baik tanpa riwayat kerusakan berat. Pemakaian tertinggi tercatat di bulan ${namaBulan[puncakBulanIdx]}.`;
                }
            }

            return res.status(200).json({
                status: "success",
                message: `Diagnosa analitik untuk barang ${barang.nama_barang} berhasil diproses.`,
                data: {
                    info_barang: {
                        id: barang.id,
                        nama: barang.nama_barang,
                        kategori: isBHP ? "BHP" : "Alat",
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