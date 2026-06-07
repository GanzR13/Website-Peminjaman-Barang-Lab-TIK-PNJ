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

const createAdminLog = require("../utils/adminActionLogger");

// ==========================================
// 1. FUNGSI HELPER: GENERATE BULAN ROMAWI
// ==========================================
const getBulanRomawi = (bulan) => {
	const romawi = [
		"",
		"I",
		"II",
		"III",
		"IV",
		"V",
		"VI",
		"VII",
		"VIII",
		"IX",
		"X",
		"XI",
		"XII",
	];
	return romawi[bulan];
};

const getNumericTargetId = (id) => {
	const parsed = Number(id);
	return Number.isInteger(parsed) ? parsed : null;
};

const getActionByStatus = (status) => {
	switch (status) {
		case "Disetujui":
			return "APPROVE";
		case "Ditolak":
			return "REJECT";
		case "Dipinjam":
			return "UPDATE_STATUS";
		case "Selesai":
			return "RETURN";
		case "Barang Rusak":
			return "UPDATE_STATUS";
		case "Dibatalkan":
			return "CANCEL";
		default:
			return "UPDATE_STATUS";
	}
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
					as: "laporan_masalah",
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
					namaAsli =
						plain.peminjam.mahasiswa.nama_mahasiswa ||
						plain.peminjam.mahasiswa.nama;
				} else if (plain.peminjam.pegawai) {
					namaAsli =
						plain.peminjam.pegawai.nama_lengkap ||
						plain.peminjam.pegawai.nama_pegawai ||
						plain.peminjam.pegawai.nama;
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

exports.getTotalPeminjamanMenunggu = async (req, res) => {
	try {
		const total = await Peminjaman.count({
			where: {
				status: "Menunggu",
			},
		});

		return res.status(200).json({
			status: "success",
			total,
		});
	} catch (error) {
		console.error("Error Count Peminjaman Menunggu:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

// ==========================================
// FUNGSI ADMIN: UPDATE STATUS (SETUJUI/TOLAK/SELESAI)
// ==========================================
exports.updateStatusPeminjaman = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;
		const { status, catatan_admin, force_selesai = false } = req.body;

		const peminjaman = await Peminjaman.findByPk(id, {
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
					include: [
						{
							model: Barang,
							as: "barang",
							attributes: ["id", "nama_barang", "stok"],
						},
					],
				},
				{
					model: LaporanMasalah,
					as: "laporan_masalah",
				},
			],
			transaction: t,
		});

		if (!peminjaman) {
			await t.rollback();

			return res.status(404).json({
				status: "error",
				message: "Data tidak ditemukan",
			});
		}

		const plainBefore = peminjaman.toJSON ? peminjaman.toJSON() : peminjaman;

		const statusSaatIni = peminjaman.status;
		const statusSudahKembali = ["Ditolak", "Dibatalkan", "Selesai"];

		const namaPeminjam =
			plainBefore.peminjam?.mahasiswa?.nama_mahasiswa ||
			plainBefore.peminjam?.pegawai?.nama_lengkap ||
			plainBefore.peminjam?.email ||
			"User Terhapus";

		const barangDipinjam = (plainBefore.detail_barang || []).map((item) => ({
			barang_id: item.barang_id,
			nama_barang: item.barang?.nama_barang || "Barang tidak ditemukan",
			jumlah_pinjam: item.jumlah_pinjam,
		}));

		// ============================================================
		// 1. VALIDASI LAPORAN KENDALA
		// ============================================================
		if (
			status === "Selesai" &&
			peminjaman.laporan_masalah &&
			peminjaman.laporan_masalah.length > 0
		) {
			const statusLaporanSelesai = [
				"Sudah Diganti",
				"Selesai Diperbaiki",
				"Rusak Total",
				"Dikonfirmasi Hilang",
				"Barang Rusak",
			];

			const laporanMenggantung = peminjaman.laporan_masalah.filter(
				(laporan) => !statusLaporanSelesai.includes(laporan.status),
			);

			if (laporanMenggantung.length > 0 && !force_selesai) {
				await t.rollback();

				return res.status(400).json({
					status: "error",
					message:
						"Transaksi tidak dapat diselesaikan karena masih ada laporan kendala yang belum diproses. Gunakan opsi penyelesaian manual jika pertanggungjawaban sudah dicatat oleh admin.",
				});
			}
		}

		// ============================================================
		// 2. KEMBALIKAN STOK JIKA TRANSAKSI SELESAI / BATAL
		// ============================================================
		let stokDikembalikan = false;

		if (
			["Ditolak", "Dibatalkan", "Selesai"].includes(status) &&
			!statusSudahKembali.includes(statusSaatIni)
		) {
			if (peminjaman.detail_barang && peminjaman.detail_barang.length > 0) {
				for (const item of peminjaman.detail_barang) {
					await Barang.increment("stok", {
						by: item.jumlah_pinjam,
						where: { id: item.barang_id },
						transaction: t,
					});
				}

				stokDikembalikan = true;
			}
		}

		if (status === "Disetujui" && peminjaman.kategori_kebutuhan === "Khusus") {
			if (peminjaman.status_approve_kalab !== "Disetujui") {
				await t.rollback();

				return res.status(400).json({
					status: "error",
					message:
						"Peminjaman khusus belum dapat disetujui karena belum disetujui Kepala Laboratorium.",
				});
			}

			const perluApprovalDosen =
				peminjaman.dosen_pj_user_id &&
				peminjaman.status_approve_dosen_pj !== "Tidak Diperlukan";

			if (
				perluApprovalDosen &&
				peminjaman.status_approve_dosen_pj !== "Disetujui"
			) {
				await t.rollback();

				return res.status(400).json({
					status: "error",
					message:
						"Peminjaman khusus belum dapat disetujui karena belum disetujui Dosen Penanggung Jawab.",
				});
			}
		}

		// ============================================================
		// 3. GENERATE NOMOR SURAT
		// ============================================================
		let nomorSuratBaru = peminjaman.nomor_surat;

		if (
			status === "Disetujui" &&
			peminjaman.kategori_kebutuhan === "Khusus" &&
			!peminjaman.nomor_surat
		) {
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
				const urutanSebelumnya = parseInt(
					transaksiTerakhir.nomor_surat.split("/")[0],
					10,
				);

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
		const catatanFinal = catatan_admin || peminjaman.catatan_admin;

		await peminjaman.update(
			{
				status,
				catatan_admin: catatanFinal,
				nomor_surat: nomorSuratBaru,
			},
			{ transaction: t },
		);

		await t.commit();

		// ============================================================
		// 5. CATAT LOG ACTION ADMIN
		// ============================================================
		await createAdminLog({
			req,
			action: getActionByStatus(status),
			module: "Peminjaman",
			description: `Mengubah status peminjaman ${namaPeminjam} dari ${statusSaatIni} menjadi ${status}`,
			target_id: getNumericTargetId(peminjaman.id),
			metadata: {
				peminjaman_id: peminjaman.id,
				antrian: peminjaman.antrian,
				user_id: peminjaman.user_id,
				nama_peminjam: namaPeminjam,
				email_peminjam: plainBefore.peminjam?.email || null,
				status_lama: statusSaatIni,
				status_baru: status,
				kategori_kebutuhan: peminjaman.kategori_kebutuhan,
				nomor_surat: nomorSuratBaru,
				force_selesai,
				stok_dikembalikan: stokDikembalikan,
				jumlah_laporan_masalah: peminjaman.laporan_masalah?.length || 0,
				barang: barangDipinjam,
			},
		});

		return res.status(200).json({
			status: "success",
			message: `Peminjaman berhasil diubah menjadi: ${status}`,
			nomor_surat: nomorSuratBaru,
		});
	} catch (error) {
		if (t) await t.rollback();

		console.error("Error Update Status:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

exports.approveKalabPeminjaman = async (req, res) => {
	try {
		const { id } = req.params;

		const userRoleId = Number(req.user?.role_id);

		if (userRoleId !== 1) {
			return res.status(403).json({
				status: "error",
				message: "Hanya Kepala Laboratorium yang dapat melakukan approval ini.",
			});
		}

		const peminjaman = await Peminjaman.findByPk(id);

		if (!peminjaman) {
			return res.status(404).json({
				status: "error",
				message: "Data peminjaman tidak ditemukan.",
			});
		}

		if (peminjaman.kategori_kebutuhan !== "Khusus") {
			return res.status(400).json({
				status: "error",
				message:
					"Approval Kepala Lab hanya diperlukan untuk peminjaman khusus.",
			});
		}

		if (peminjaman.status_approve_kalab === "Disetujui") {
			return res.status(400).json({
				status: "error",
				message: "Peminjaman ini sudah disetujui Kepala Laboratorium.",
			});
		}

		await peminjaman.update({
			status_approve_kalab: "Disetujui",
			kalab_approved_by: req.user.id,
			kalab_approved_at: new Date(),
		});

		return res.status(200).json({
			status: "success",
			message: "Peminjaman berhasil disetujui Kepala Laboratorium.",
		});
	} catch (error) {
		console.error("Error Approve Kalab Peminjaman:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};
