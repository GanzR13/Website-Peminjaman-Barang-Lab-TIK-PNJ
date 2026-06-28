"use strict";

const {
	Peminjaman,
	DetailPeminjaman,
	Barang,
	User,
	Pegawai,
	sequelize,
} = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const { generateSuratPeminjamanPDF } = require("../utils/suratGenerator");

const attachKalabApprover = async (riwayat = []) => {
	const plainRiwayat = riwayat.map((item) =>
		item.get ? item.get({ plain: true }) : item,
	);

	const kalabUserIds = [
		...new Set(
			plainRiwayat.map((item) => item.kalab_approved_by).filter(Boolean),
		),
	];

	if (kalabUserIds.length === 0) {
		return plainRiwayat.map((item) => ({
			...item,
			approved_kalab: null,
		}));
	}

	const kalabUsers = await User.findAll({
		where: {
			id: {
				[Op.in]: kalabUserIds,
			},
		},
		attributes: ["id", "email", "ttd_digital"],
		include: [
			{
				model: Pegawai,
				as: "pegawai",
				attributes: ["nama_lengkap", "nip"],
			},
		],
	});

	const kalabMap = {};

	kalabUsers.forEach((user) => {
		const plainUser = user.get ? user.get({ plain: true }) : user;

		kalabMap[plainUser.id] = {
			id: plainUser.id,
			email: plainUser.email,
			nama_lengkap: plainUser.pegawai?.nama_lengkap || plainUser.email,
			nip: plainUser.pegawai?.nip || "-",
			ttd_digital: plainUser.ttd_digital || null,
		};
	});

	return plainRiwayat.map((item) => ({
		...item,
		approved_kalab: item.kalab_approved_by
			? kalabMap[item.kalab_approved_by] || null
			: null,
	}));
};

const attachDosenPjApprover = async (riwayat = []) => {
	const plainRiwayat = riwayat.map((item) =>
		item.get ? item.get({ plain: true }) : item,
	);

	const dosenUserIds = [
		...new Set(
			plainRiwayat.map((item) => item.dosen_pj_user_id).filter(Boolean),
		),
	];

	if (dosenUserIds.length === 0) {
		return plainRiwayat.map((item) => ({
			...item,
			approved_dosen_pj: null,
		}));
	}

	const dosenUsers = await User.findAll({
		where: {
			id: {
				[Op.in]: dosenUserIds,
			},
		},
		attributes: ["id", "email", "ttd_digital"],
		include: [
			{
				model: Pegawai,
				as: "pegawai",
				attributes: ["nama_lengkap", "nip"],
			},
		],
	});

	const dosenMap = {};

	dosenUsers.forEach((user) => {
		const plainUser = user.get ? user.get({ plain: true }) : user;

		dosenMap[plainUser.id] = {
			id: plainUser.id,
			email: plainUser.email,
			nama_lengkap: plainUser.pegawai?.nama_lengkap || plainUser.email,
			nip: plainUser.pegawai?.nip || "-",
			ttd_digital: plainUser.ttd_digital || null,
		};
	});

	return plainRiwayat.map((item) => ({
		...item,
		approved_dosen_pj: item.dosen_pj_user_id
			? dosenMap[item.dosen_pj_user_id] || null
			: null,
	}));
};

exports.previewSuratPeminjaman = async (req, res) => {
	try {
		const peminjamanId = req.params.id;
		const userId = req.user.id;

		const peminjaman = await Peminjaman.findOne({
			where: {
				id: peminjamanId,
				user_id: userId,
			},
			attributes: ["id", "kode_peminjaman"],
		});

		if (!peminjaman) {
			return res.status(404).json({
				status: "error",
				message: "Data peminjaman tidak ditemukan.",
			});
		}

		const pdfPath = await generateSuratPeminjamanPDF({
			peminjaman_id: peminjaman.id,
			kode_peminjaman: peminjaman.kode_peminjaman,
		});

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`inline; filename="surat-${peminjaman.kode_peminjaman}.pdf"`
		);

		const stream = fs.createReadStream(pdfPath);

		stream.on("error", (error) => {
			console.error("[SURAT] Gagal membaca file PDF:", error);
			if (!res.headersSent) {
				res.status(500).json({
					status: "error",
					message: "Gagal membaca file surat.",
				});
			}
		});

		stream.pipe(res);
	} catch (error) {
		console.error("[SURAT] Gagal preview surat user:", error);

		res.status(500).json({
			status: "error",
			message: "Gagal membuat preview surat.",
			error: error.message,
		});
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

exports.checkoutPeminjaman = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const {
			kategori_kebutuhan,
			tujuan_peminjaman,
			nama_acara,
			organisasi_penyelenggara,
			dosen_pj_user_id,
			dosen_penanggung_jawab,
			nip_dosen_pj,
			jenis_khusus,
			tanggal_pinjam,
			tanggal_kembali,
			keranjang_barang,
		} = req.body;

		const user_id = req.user.id;

		if (!Array.isArray(keranjang_barang) || keranjang_barang.length === 0) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Keranjang barang tidak boleh kosong!",
			});
		}

		if (!kategori_kebutuhan) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Kategori kebutuhan wajib dipilih.",
			});
		}

		if (!tujuan_peminjaman) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Tujuan peminjaman wajib diisi.",
			});
		}

		if (!tanggal_pinjam || !tanggal_kembali) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Tanggal pinjam dan tanggal kembali wajib diisi.",
			});
		}

		if (kategori_kebutuhan === "Khusus" && !jenis_khusus) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Jenis kegiatan khusus wajib dipilih.",
			});
		}

		if (
			kategori_kebutuhan === "Khusus" &&
			jenis_khusus === "Organisasi" &&
			(!nama_acara || !organisasi_penyelenggara)
		) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message:
					"Nama acara dan organisasi penyelenggara wajib diisi untuk peminjaman organisasi.",
			});
		}

		for (const item of keranjang_barang) {
			const jumlah = Number(item.jumlah || 0);

			if (!item.barang_id || jumlah < 1) {
				throw new Error("Data barang pada keranjang tidak valid.");
			}

			const barangLokal = await Barang.findByPk(item.barang_id, {
				transaction: t,
			});

			if (!barangLokal) {
				throw new Error(`Barang dengan ID ${item.barang_id} tidak ditemukan.`);
			}

			if (barangLokal.stok < jumlah) {
				throw new Error(
					`Stok "${barangLokal.nama_barang}" tidak mencukupi. Sisa stok: ${barangLokal.stok}`,
				);
			}

			await barangLokal.decrement("stok", {
				by: jumlah,
				transaction: t,
			});
		}

		const awalHariIni = new Date();
		awalHariIni.setHours(0, 0, 0, 0);

		const awalBesok = new Date(awalHariIni);
		awalBesok.setDate(awalBesok.getDate() + 1);

		const transaksiTerakhir = await Peminjaman.findOne({
			where: {
				createdAt: {
					[Op.gte]: awalHariIni,
					[Op.lt]: awalBesok,
				},
			},
			order: [["antrian", "DESC"]],
			transaction: t,
		});

		const nomorAntrianBaru =
			transaksiTerakhir && transaksiTerakhir.antrian
				? transaksiTerakhir.antrian + 1
				: 1;

		const kodePeminjaman = await generateKodePeminjaman(t);

		const peminjamanBaru = await Peminjaman.create(
			{
				user_id,
				antrian: nomorAntrianBaru,
				kode_peminjaman: kodePeminjaman,

				kategori_kebutuhan,
				jenis_khusus:
					kategori_kebutuhan === "Khusus" ? jenis_khusus || null : null,
				tujuan_peminjaman,

				nama_acara:
					kategori_kebutuhan === "Khusus" && jenis_khusus === "Organisasi"
						? nama_acara || null
						: null,

				organisasi_penyelenggara:
					kategori_kebutuhan === "Khusus" && jenis_khusus === "Organisasi"
						? organisasi_penyelenggara || null
						: null,

				dosen_pj_user_id:
					kategori_kebutuhan === "Khusus" ? dosen_pj_user_id || null : null,

				status_approve_dosen_pj:
					kategori_kebutuhan === "Khusus" && dosen_pj_user_id
						? "Menunggu"
						: "Tidak Diperlukan",

				dosen_pj_approved_at: null,

				dosen_penanggung_jawab:
					kategori_kebutuhan === "Khusus"
						? dosen_penanggung_jawab || null
						: null,

				nip_dosen_pj:
					kategori_kebutuhan === "Khusus" ? nip_dosen_pj || null : null,

				status_approve_kalab:
					kategori_kebutuhan === "Khusus" ? "Menunggu" : "Tidak Diperlukan",

				kalab_approved_by: null,
				kalab_approved_at: null,

				file_surat_url: null,
				file_surat_drive_id: null,

				tanggal_pinjam,
				tanggal_kembali,
				status: "Menunggu",
			},
			{ transaction: t },
		);

		const detailData = keranjang_barang.map((item) => ({
			peminjaman_id: peminjamanBaru.id,
			barang_id: item.barang_id,
			jumlah_pinjam: Number(item.jumlah),
			status_barang: "Dipinjam",
		}));

		await DetailPeminjaman.bulkCreate(detailData, { transaction: t });

		await t.commit();

		return res.status(201).json({
			status: "success",
			message: `Permohonan peminjaman berhasil dikirim! Kode Peminjaman: ${kodePeminjaman}, Nomor Antrian: #${nomorAntrianBaru}`,
			data: peminjamanBaru,
		});
	} catch (error) {
		if (t) await t.rollback();

		const statusCode =
			error.message.includes("Stok") ||
			error.message.includes("tidak valid") ||
			error.message.includes("tidak ditemukan")
				? 400
				: 500;

		return res.status(statusCode).json({
			status: "error",
			message: error.message,
		});
	}
};

exports.getRiwayatSaya = async (req, res) => {
	try {
		const user_id = req.user.id;

		const riwayat = await Peminjaman.findAll({
			where: { user_id },
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: DetailPeminjaman,
					as: "detail_barang",
					include: [
						{
							model: Barang,
							as: "barang",
							attributes: ["id", "nama_barang", "gambar"],
						},
					],
				},
			],
		});

		let dataRiwayat = await attachKalabApprover(riwayat);
		dataRiwayat = await attachDosenPjApprover(dataRiwayat);

		return res.status(200).json({
			status: "success",
			data: dataRiwayat,
		});
	} catch (error) {
		console.error("Error Get Riwayat Saya:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

// Fungsi Batalkan Peminjaman (Hanya jika masih status 'Menunggu')
exports.batalkanPeminjaman = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;
		const user_id = req.user.id;

		const peminjaman = await Peminjaman.findOne({
			where: {
				id: id,
				user_id: user_id,
			},
			transaction: t,
		});

		if (!peminjaman) {
			await t.rollback();
			return res.status(404).json({
				status: "error",
				message:
					"Data peminjaman tidak ditemukan atau Anda tidak memiliki akses ke data ini.",
			});
		}

		if (peminjaman.status !== "Menunggu") {
			await t.rollback();
			return res.status(400).json({
				status: "error",
				message:
					"Peminjaman tidak dapat dibatalkan karena sedang atau sudah diproses oleh Admin.",
			});
		}

		const detailBarang = await DetailPeminjaman.findAll({
			where: { peminjaman_id: id },
			transaction: t,
		});

		if (detailBarang && detailBarang.length > 0) {
			for (const item of detailBarang) {
				const barangLokal = await Barang.findByPk(item.barang_id, {
					transaction: t,
				});

				if (barangLokal) {
					// Menambahkan kembali stok yang sebelumnya dikurangi
					await barangLokal.increment("stok", {
						by: item.jumlah_pinjam,
						transaction: t,
					});
				}
			}
		}

		// Hapus Data Peminjam

		// Hapus detailnya dulu
		await DetailPeminjaman.destroy({
			where: { peminjaman_id: id },
			transaction: t,
		});

		// Hapus data peminjaman utama
		await peminjaman.destroy({ transaction: t });

		// Simpan semua perubahan
		await t.commit();

		return res.status(200).json({
			status: "success",
			message:
				"Permohonan berhasil dibatalkan dan stok alat telah dikembalikan.",
		});
	} catch (error) {
		if (t) await t.rollback();
		console.error("Error Batalkan Peminjaman:", error);

		return res.status(500).json({
			status: "error",
			message: "Terjadi kesalahan server saat membatalkan peminjaman.",
			error_detail: error.message,
		});
	}
};

exports.updatePeminjamanSaya = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;
		const user_id = req.user.id;

		const {
			kategori_kebutuhan,
			tujuan_peminjaman,
			nama_acara,
			organisasi_penyelenggara,
			dosen_pj_user_id,
			dosen_penanggung_jawab,
			nip_dosen_pj,
			jenis_khusus,
			tanggal_pinjam,
			tanggal_kembali,
			keranjang_barang,
			status_approve_dosen_pj,
			dosen_pj_approved_at,
		} = req.body;

		const peminjaman = await Peminjaman.findOne({
			where: { id, user_id },
			transaction: t,
		});

		if (!peminjaman) {
			await t.rollback();
			return res
				.status(404)
				.json({ status: "error", message: "Transaksi tidak ditemukan." });
		}

		if (peminjaman.status !== "Menunggu") {
			await t.rollback();
			return res.status(400).json({
				status: "error",
				message: "Tidak dapat diedit karena sudah diproses Admin.",
			});
		}

		if (!keranjang_barang || keranjang_barang.length === 0) {
			await t.rollback();
			return res
				.status(400)
				.json({ status: "error", message: "Keranjang tidak boleh kosong!" });
		}

		const detailLama = await DetailPeminjaman.findAll({
			where: { peminjaman_id: peminjaman.id },
			transaction: t,
		});

		for (const item of detailLama) {
			const barangLokal = await Barang.findByPk(item.barang_id, {
				transaction: t,
			});
			if (barangLokal) {
				await barangLokal.increment("stok", {
					by: item.jumlah_pinjam,
					transaction: t,
				});
			}
		}

		await DetailPeminjaman.destroy({
			where: { peminjaman_id: peminjaman.id },
			transaction: t,
		});

		for (const item of keranjang_barang) {
			const barangLokal = await Barang.findByPk(item.barang_id, {
				transaction: t,
			});

			if (!barangLokal)
				throw new Error(`Barang ID ${item.barang_id} tidak ditemukan.`);
			if (barangLokal.stok < item.jumlah) {
				throw new Error(`Stok "${barangLokal.nama_barang}" tidak mencukupi.`);
			}

			await barangLokal.decrement("stok", { by: item.jumlah, transaction: t });
		}

		await peminjaman.update(
			{
				kategori_kebutuhan,
				jenis_khusus:
					kategori_kebutuhan === "Khusus" ? jenis_khusus || null : null,
				tujuan_peminjaman,

				nama_acara:
					kategori_kebutuhan === "Khusus" && jenis_khusus === "Organisasi"
						? nama_acara || null
						: null,

				organisasi_penyelenggara:
					kategori_kebutuhan === "Khusus" && jenis_khusus === "Organisasi"
						? organisasi_penyelenggara || null
						: null,

				dosen_pj_user_id:
					kategori_kebutuhan === "Khusus" ? dosen_pj_user_id || null : null,

				status_approve_dosen_pj:
					kategori_kebutuhan === "Khusus" && dosen_pj_user_id
						? "Menunggu"
						: "Tidak Diperlukan",

				dosen_pj_approved_at: null,

				dosen_penanggung_jawab:
					kategori_kebutuhan === "Khusus"
						? dosen_penanggung_jawab || null
						: null,

				nip_dosen_pj:
					kategori_kebutuhan === "Khusus" ? nip_dosen_pj || null : null,

				status_approve_kalab:
					kategori_kebutuhan === "Khusus" ? "Menunggu" : "Tidak Diperlukan",

				kalab_approved_by: null,
				kalab_approved_at: null,

				file_surat_url: null,
				file_surat_drive_id: null,

				tanggal_pinjam,
				tanggal_kembali,
			},
			{ transaction: t },
		);

		const detailDataBaru = keranjang_barang.map((item) => ({
			peminjaman_id: peminjaman.id,
			barang_id: item.barang_id,
			jumlah_pinjam: item.jumlah,
			status_barang: "Dipinjam",
		}));

		await DetailPeminjaman.bulkCreate(detailDataBaru, { transaction: t });

		await t.commit();
		res.status(200).json({
			status: "success",
			message: "Keranjang peminjaman berhasil diperbarui!",
		});
	} catch (error) {
		await t.rollback();
		const statusCode = error.message.includes("Stok") ? 400 : 500;
		res.status(statusCode).json({ status: "error", message: error.message });
	}
};
