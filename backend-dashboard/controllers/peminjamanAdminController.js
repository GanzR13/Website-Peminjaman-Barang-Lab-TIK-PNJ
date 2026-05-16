"use strict";

const {
	Peminjaman,
	DetailPeminjaman,
	Barang,
	User,
	Mahasiswa,
	Pegawai,
	LaporanMasalah,
	sequelize,
} = require("../models");
const { Op } = require("sequelize");

// ==========================================
// 1. FUNGSI HELPER: GENERATE BULAN ROMAWI
// ==========================================
const getBulanRomawi = (bulan) => {
	const romawi = [
		"", "I", "II", "III", "IV", "V", "VI",
		"VII", "VIII", "IX", "X", "XI", "XII",
	];
	return romawi[bulan];
};

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
			distinct: true, // Mencegah duplikasi hitungan akibat join banyak tabel
			include: [
				{
					model: User,
					as: "peminjam",
					attributes: ["id", "email"],
					include: [
						{ model: Mahasiswa, as: "mahasiswa" },
						{ model: Pegawai, as: "pegawai" },
					],
				},
				{
					model: DetailPeminjaman,
					as: "detail_barang",
					include: [{ model: Barang, as: "barang" }],
				},
                // Include data laporan masalah ke frontend
				{ 
                    model: LaporanMasalah, 
                    as: "laporan_masalah" 
                },
			],
			order: [
				["createdAt", "DESC"], // Biasanya Admin lebih suka melihat antrian terbaru di atas
				["antrian", "ASC"],
			],
		});

		const mappedData = rows.map((item) => {
			const plain = item.get({ plain: true });
			let namaAsli = "User Terhapus";

			if (plain.peminjam) {
				if (plain.peminjam.mahasiswa) {
					namaAsli = plain.peminjam.mahasiswa.nama_mahasiswa || plain.peminjam.mahasiswa.nama;
				} else if (plain.peminjam.pegawai) {
					namaAsli = plain.peminjam.pegawai.nama_lengkap || plain.peminjam.pegawai.nama_pegawai || plain.peminjam.pegawai.nama;
				}

				if (!namaAsli || String(namaAsli).trim() === "") {
					namaAsli = plain.peminjam.email || `User ID: ${plain.user_id}`;
				}
			}

			return {
				...plain,
				nama_peminjam: namaAsli,
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
				itemsPerPage: limit,
			},
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
			include: [
                { model: DetailPeminjaman, as: "detail_barang" },
                // Kita perlu include laporan untuk divalidasi
                { model: LaporanMasalah, as: "laporan_masalah" }
            ],
			transaction: t,
		});

		if (!peminjaman) {
			await t.rollback();
			return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
		}

		const statusSaatIni = peminjaman.status;
		const statusSudahKembali = ["Ditolak", "Dibatalkan", "Selesai"];

        // ============================================================
		// 1. VALIDASI: JANGAN IZINKAN SELESAI JIKA ADA LAPORAN MENGGANTUNG
		// ============================================================
        if (status === "Selesai" && peminjaman.laporan_masalah && peminjaman.laporan_masalah.length > 0) {
            // Cek apakah ada laporan yang belum berstatus 'selesai' (Sudah Diganti / Selesai Diperbaiki / Rusak Total)
            const statusLaporanSelesai = ["Sudah Diganti", "Selesai Diperbaiki", "Rusak Total", "Dikonfirmasi Hilang"];
            
            const laporanMenggantung = peminjaman.laporan_masalah.filter(
                (laporan) => !statusLaporanSelesai.includes(laporan.status)
            );

            if (laporanMenggantung.length > 0) {
                await t.rollback();
                return res.status(400).json({ 
                    status: "error", 
                    message: "Transaksi tidak dapat diselesaikan! Masih ada Laporan Kerusakan/Kehilangan yang belum diproses oleh Admin." 
                });
            }
        }

        // ============================================================
		// 2. KEMBALIKAN STOK JIKA TRANSAKSI SELESAI / BATAL
		// ============================================================
		if (["Ditolak", "Dibatalkan", "Selesai"].includes(status) && !statusSudahKembali.includes(statusSaatIni)) {
			if (peminjaman.detail_barang && peminjaman.detail_barang.length > 0) {
				for (const item of peminjaman.detail_barang) {
					await Barang.increment("stok", {
						by: item.jumlah_pinjam,
						where: { id: item.barang_id },
						transaction: t,
					});
				}
			}
		}

		// ============================================================
		// 3. LOGIKA GENERATE NOMOR SURAT (JIKA DISETUJUI & KHUSUS)
		// ============================================================
		let nomorSuratBaru = peminjaman.nomor_surat;

		if (status === "Disetujui" && peminjaman.kategori_kebutuhan === "Khusus" && !peminjaman.nomor_surat) {
			const dateObj = new Date();
			const tahun = dateObj.getFullYear();
			const bulanRomawi = getBulanRomawi(dateObj.getMonth() + 1);

			const transaksiTerakhir = await Peminjaman.findOne({
				where: {
					nomor_surat: { [Op.not]: null },
					createdAt: {
						[Op.gte]: new Date(`${tahun}-01-01`),
						[Op.lte]: new Date(`${tahun}-12-31T23:59:59.999Z`),
					},
				},
				order: [["nomor_surat", "DESC"]], 
				transaction: t,
			});

			let urutanKe = 1;
			if (transaksiTerakhir && transaksiTerakhir.nomor_surat) {
				const urutanSebelumnya = parseInt(transaksiTerakhir.nomor_surat.split("/")[0], 10);
				if (!isNaN(urutanSebelumnya)) {
					urutanKe = urutanSebelumnya + 1;
				}
			}

			const urutanPad = String(urutanKe).padStart(3, "0");
			nomorSuratBaru = `${urutanPad}/LAB-TI/${bulanRomawi}/${tahun}`;
		}

		// ============================================================
		// 4. SIMPAN PERUBAHAN
		// ============================================================
		await peminjaman.update(
			{
				status: status,
				catatan_admin: catatan_admin || peminjaman.catatan_admin,
				nomor_surat: nomorSuratBaru,
			},
			{ transaction: t }
		);

		await t.commit();

		res.status(200).json({
			status: "success",
			message: `Peminjaman berhasil diubah menjadi: ${status}`,
			nomor_surat: nomorSuratBaru,
		});
	} catch (error) {
		if (t) await t.rollback();
		console.error("Error Update Status:", error);
		res.status(500).json({ status: "error", message: error.message });
	}
};