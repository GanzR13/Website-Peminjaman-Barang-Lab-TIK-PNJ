"use strict";

const fs = require("fs");

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
const { generateSuratPeminjamanPDF } = require("../utils/suratGenerator");
const { uploadPdfToDrive } = require("../utils/googleDriveUploader");

const getNumericTargetId = (id) => {
	const parsed = Number(id);
	return Number.isInteger(parsed) ? parsed : null;
};

const normalizeText = (value) => {
	return String(value || "")
		.trim()
		.toLowerCase();
};

const getJumlahLaporan = (laporanPlain) => {
	const jumlah = Number(
		laporanPlain.jumlah_hilang ||
			laporanPlain.jumlah_rusak ||
			laporanPlain.jumlah_barang_rusak ||
			laporanPlain.jumlah_barang_hilang ||
			laporanPlain.jumlah ||
			1,
	);

	return jumlah > 0 ? jumlah : 1;
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

const generateKodePeminjaman = async (transaction) => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const yearMonth = `${year}${month}`;
	const prefix = `REQ-${yearMonth}-`;

	const transaksiTerakhir = await Peminjaman.findOne({
		where: {
			kode_peminjaman: {
				[Op.like]: `${prefix}%`,
			},
		},
		order: [["kode_peminjaman", "DESC"]],
		transaction,
	});

	let urutan = "001";

	if (transaksiTerakhir?.kode_peminjaman) {
		const lastNumber = Number(
			transaksiTerakhir.kode_peminjaman.split("-").pop(),
		);

		if (!Number.isNaN(lastNumber)) {
			urutan = String(lastNumber + 1).padStart(3, "0");
		}
	}

	return `REQ-${yearMonth}-${urutan}`;
};

const uploadSuratPeminjamanKeDrive = async ({ peminjamanId, kodePeminjaman }) => {
	console.log("[SURAT] Mulai generate surat:", {
		peminjamanId,
		kodePeminjaman,
	});

	const pdfPath = await generateSuratPeminjamanPDF({
		peminjaman_id: peminjamanId,
		kode_peminjaman: kodePeminjaman,
	});

	console.log("[SURAT] PDF path:", pdfPath);
	console.log("[SURAT] PDF exists:", !!pdfPath && fs.existsSync(pdfPath));

	if (!pdfPath || !fs.existsSync(pdfPath)) {
		throw new Error(`File PDF surat tidak ditemukan: ${pdfPath}`);
	}

	const uploaded = await uploadPdfToDrive({
		filePath: pdfPath,
		fileName: `${kodePeminjaman}.pdf`,
	});

	console.log("[SURAT] Upload Drive berhasil:", uploaded);

	await Peminjaman.update(
		{
			file_surat_url: uploaded.file_surat_url,
			file_surat_drive_id: uploaded.file_surat_drive_id,
		},
		{
			where: { id: peminjamanId },
		},
	);

	try {
		fs.unlinkSync(pdfPath);
	} catch (error) {
		console.warn("[SURAT] Gagal menghapus file temp:", error.message);
	}

	return uploaded;
};

exports.getAllPeminjaman = async (req, res) => {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const offset = (page - 1) * limit;

		const { count, rows } = await Peminjaman.findAndCountAll({
			limit,
			offset,
			distinct: true,
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
				{
					model: LaporanMasalah,
					as: "laporan_masalah",
				},
			],
			order: [
				["createdAt", "DESC"],
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

		return res.status(200).json({
			status: "success",
			data: mappedData,
			pagination: {
				totalItems: count,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		console.error("Error Admin GetAllPeminjaman:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
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


exports.updateStatusPeminjaman = async (req, res) => {
	const t = await sequelize.transaction();
	let transactionCommitted = false;

	try {
		const { id } = req.params;
		const { status, catatan_admin, force_selesai = false } = req.body;

		if (!status) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Status peminjaman wajib diisi.",
			});
		}

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
				message: "Data peminjaman tidak ditemukan.",
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

		// Validasi: Jika status diubah menjadi Selesai, pastikan semua laporan terkait sudah diproses.
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

		// Kembalikan stok barang jika status peminjaman berubah menjadi Ditolak, Dibatalkan, atau Selesai
		let stokDikembalikan = false;
		const detailStokDikembalikan = [];

		const isStatusPengembaliStok = ["Ditolak", "Dibatalkan", "Selesai"].includes(
			status,
		);
		const belumPernahKembali = !statusSudahKembali.includes(statusSaatIni);

		if (isStatusPengembaliStok && belumPernahKembali) {
			if (peminjaman.detail_barang && peminjaman.detail_barang.length > 0) {
				const jumlahTertahanByBarangId = {};

				if (status === "Selesai" && peminjaman.laporan_masalah?.length > 0) {
					for (const laporan of peminjaman.laporan_masalah) {
						const laporanPlain = laporan.toJSON ? laporan.toJSON() : laporan;

						const statusLaporan = normalizeText(laporanPlain.status);
						const jenisLaporan = normalizeText(
							laporanPlain.jenis_laporan ||
								laporanPlain.jenis_masalah ||
								laporanPlain.kategori_masalah ||
								laporanPlain.tipe_laporan ||
								"",
						);

						const isBarangHilang =
							statusLaporan.includes("hilang") ||
							jenisLaporan.includes("hilang") ||
							statusLaporan === "dikonfirmasi hilang";

						const isBarangSudahDiganti = statusLaporan === "sudah diganti";
						const isSelesaiDiperbaiki =
							statusLaporan === "selesai diperbaiki";

						const isBarangRusakBelumKembali =
							statusLaporan.includes("barang rusak") ||
							statusLaporan.includes("rusak total") ||
							statusLaporan.includes("perlu perbaikan") ||
							statusLaporan.includes("belum diperbaiki") ||
							statusLaporan.includes("menunggu perbaikan") ||
							statusLaporan.includes("sedang diservis") ||
							jenisLaporan.includes("rusak") ||
							jenisLaporan.includes("kerusakan");

						if (
							isBarangSudahDiganti ||
							isSelesaiDiperbaiki ||
							(!isBarangHilang && !isBarangRusakBelumKembali)
						) {
							continue;
						}

						const barangId =
							laporanPlain.barang_id ||
							laporanPlain.id_barang ||
							laporanPlain.detail_barang?.barang_id ||
							laporanPlain.detail_peminjaman?.barang_id;

						if (!barangId) continue;

						const jumlahTertahan = getJumlahLaporan(laporanPlain);

						jumlahTertahanByBarangId[barangId] =
							(jumlahTertahanByBarangId[barangId] || 0) + jumlahTertahan;
					}
				}

				for (const item of peminjaman.detail_barang) {
					const barangId = item.barang_id;
					const jumlahPinjam = Number(item.jumlah_pinjam || 0);

					const jumlahTertahan =
						status === "Selesai"
							? Number(jumlahTertahanByBarangId[barangId] || 0)
							: 0;

					const jumlahKembali = Math.max(jumlahPinjam - jumlahTertahan, 0);

					if (jumlahKembali > 0) {
						await Barang.increment("stok", {
							by: jumlahKembali,
							where: { id: barangId },
							transaction: t,
						});
					}

					detailStokDikembalikan.push({
						barang_id: barangId,
						nama_barang: item.barang?.nama_barang || "Barang tidak ditemukan",
						jumlah_pinjam: jumlahPinjam,
						jumlah_tertahan: jumlahTertahan,
						jumlah_stok_dikembalikan: jumlahKembali,
					});
				}

				stokDikembalikan = true;
			}
		}

		// Validasi khusus untuk peminjaman kategori "Khusus" yang memerlukan persetujuan Kepala Laboratorium dan Dosen Penanggung Jawab.
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

		let kodePeminjamanBaru = peminjaman.kode_peminjaman;

		if (status === "Disetujui" && !kodePeminjamanBaru) {
			kodePeminjamanBaru = await generateKodePeminjaman(t);
		}

		const perluGenerateSurat =
			status === "Disetujui" &&
			peminjaman.kategori_kebutuhan === "Khusus" &&
			!peminjaman.file_surat_url;

		const catatanFinal = catatan_admin || peminjaman.catatan_admin;

		await peminjaman.update(
			{
				status,
				catatan_admin: catatanFinal,
				kode_peminjaman: kodePeminjamanBaru,
			},
			{ transaction: t },
		);

		await t.commit();
		transactionCommitted = true;

		let suratUploaded = null;
		let suratUploadError = null;

		if (perluGenerateSurat) {
			try {
				suratUploaded = await uploadSuratPeminjamanKeDrive({
					peminjamanId: peminjaman.id,
					kodePeminjaman: kodePeminjamanBaru,
				});
			} catch (error) {
				suratUploadError = error.message;
				console.error("Gagal generate/upload surat ke Drive:", error);
			}
		}

		try {
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
					kode_peminjaman: kodePeminjamanBaru,
					file_surat_url: suratUploaded?.file_surat_url || null,
					file_surat_drive_id: suratUploaded?.file_surat_drive_id || null,
					surat_upload_error: suratUploadError,
					force_selesai,
					stok_dikembalikan: stokDikembalikan,
					detail_stok_dikembalikan: detailStokDikembalikan,
					jumlah_laporan_masalah: peminjaman.laporan_masalah?.length || 0,
					barang: barangDipinjam,
				},
			});
		} catch (logError) {
			console.error("Gagal mencatat admin log:", logError);
		}

		return res.status(200).json({
			status: "success",
			message: suratUploadError
				? `Peminjaman berhasil diubah menjadi: ${status}, tetapi surat gagal diupload ke Drive.`
				: `Peminjaman berhasil diubah menjadi: ${status}`,
			kode_peminjaman: kodePeminjamanBaru,
			file_surat_url: suratUploaded?.file_surat_url || null,
			file_surat_drive_id: suratUploaded?.file_surat_drive_id || null,
			surat_upload_error: suratUploadError,
		});
	} catch (error) {
		if (!transactionCommitted) {
			await t.rollback();
		}

		console.error("Error Update Status:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
			detail: error.parent?.detail || error.original?.detail || null,
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