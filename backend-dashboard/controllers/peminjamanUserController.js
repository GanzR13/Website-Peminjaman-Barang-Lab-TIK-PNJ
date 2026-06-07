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

		if (!keranjang_barang || keranjang_barang.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "Keranjang barang tidak boleh kosong!",
			});
		}

		// --- TAMBAHAN LOGIKA BISNIS: VALIDASI & POTONG STOK ---
		// Kita loop keranjang untuk mengecek stok di DB secara realtime
		for (const item of keranjang_barang) {
			const barangLokal = await Barang.findByPk(item.barang_id, {
				transaction: t,
			});

			if (!barangLokal) {
				throw new Error(`Barang dengan ID ${item.barang_id} tidak ditemukan.`);
			}

			if (barangLokal.stok < item.jumlah) {
				// Jika stok tidak cukup, lemparkan error agar transaksi otomatis di-rollback
				throw new Error(
					`Stok "${barangLokal.nama_barang}" tidak mencukupi. Sisa stok: ${barangLokal.stok}`,
				);
			}

			// Kurangi stok barang sejumlah yang dipinjam
			await barangLokal.decrement("stok", { by: item.jumlah, transaction: t });
		}
		// -----------------------------------------------------

		// --- TAMBAHAN LOGIKA BISNIS: GENERATE ANTRIAN HARIAN ---
		const awalHariIni = new Date();
		awalHariIni.setHours(0, 0, 0, 0);

		const awalBesok = new Date(awalHariIni);
		awalBesok.setDate(awalBesok.getDate() + 1);

		// Cari peminjaman terakhir yang dibuat pada hari ini
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

		// Jika hari ini sudah ada transaksi, tambah 1. Jika belum, mulai dari 1.
		const nomorAntrianBaru =
			transaksiTerakhir && transaksiTerakhir.antrian
				? transaksiTerakhir.antrian + 1
				: 1;
		// -----------------------------------------------------

		// Simpan data ke tabel Induk (Peminjaman)
		const peminjamanBaru = await Peminjaman.create(
			{
				user_id,
				antrian: nomorAntrianBaru, // <-- Masukkan nomor antrian ke sini
				kategori_kebutuhan,
				jenis_khusus: jenis_khusus || null,
				tujuan_peminjaman,
				nama_acara: nama_acara || null,
				organisasi_penyelenggara: organisasi_penyelenggara || null,
				dosen_pj_user_id: dosen_pj_user_id || null,
				status_approve_dosen_pj: dosen_pj_user_id
					? "Menunggu"
					: "Tidak Diperlukan",
				dosen_pj_approved_at: null,
				dosen_penanggung_jawab: dosen_penanggung_jawab || null,
				nip_dosen_pj: nip_dosen_pj || null,
				tanggal_pinjam,
				tanggal_kembali,
				status: "Menunggu",
			},
			{ transaction: t },
		);

		// Siapkan data untuk tabel DetailPeminjaman
		const detailData = keranjang_barang.map((item) => {
			return {
				peminjaman_id: peminjamanBaru.id,
				barang_id: item.barang_id,
				jumlah_pinjam: item.jumlah,
				status_barang: "Dipinjam",
			};
		});

		// Simpan banyak data sekaligus (Bulk Insert) ke tabel DetailPeminjaman
		await DetailPeminjaman.bulkCreate(detailData, { transaction: t });

		// Jika semua berhasil (insert Peminjaman, insert Detail, dan potong Stok), COMMIT transaksinya!
		await t.commit();

		res.status(201).json({
			status: "success",
			message: `Permohonan peminjaman berhasil dikirim! Nomor Antrian Anda: #${nomorAntrianBaru}`, // <-- Pesan sukses diperbarui
			data: peminjamanBaru,
		});
	} catch (error) {
		// BATALKAN SEMUANYA jika ada error (Termasuk mengembalikan stok yang tadinya sempat mau dipotong)
		await t.rollback();
		// Bedakan status code: jika error dari stok kurang, kirim 400 (Bad Request). Jika error server, 500.
		const statusCode = error.message.includes("Stok") ? 400 : 500;
		res.status(statusCode).json({ status: "error", message: error.message });
	}
};

// FUNGSI 2: GET RIWAYAT SAYA (Khusus untuk user yang sedang login)
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

// FUNGSI 3: BATALKAN PEMINJAMAN (Hanya jika masih 'Menunggu')
exports.batalkanPeminjaman = async (req, res) => {
	// Memulai transaksi agar jika satu proses gagal, semua dibatalkan (aman)
	const t = await sequelize.transaction();

	try {
		const { id } = req.params; // ID Peminjaman dari URL
		const user_id = req.user.id; // ID User dari middleware auth

		// 1. Cari data peminjaman HANYA berdasarkan ID dan User_id
		// (Kita pisahkan Include-nya sementara agar pencarian utama tidak terganggu jika alias salah)
		const peminjaman = await Peminjaman.findOne({
			where: {
				id: id,
				user_id: user_id,
			},
			transaction: t,
		});

		// 2. Validasi keberadaan data (Inilah yang melempar 404 sebelumnya)
		if (!peminjaman) {
			await t.rollback();
			return res.status(404).json({
				status: "error",
				message:
					"Data peminjaman tidak ditemukan atau Anda tidak memiliki akses ke data ini.",
			});
		}

		// 3. Validasi status (Hanya bisa batal jika masih 'Menunggu')
		if (peminjaman.status !== "Menunggu") {
			await t.rollback();
			return res.status(400).json({
				status: "error",
				message:
					"Peminjaman tidak dapat dibatalkan karena sedang atau sudah diproses oleh Admin.",
			});
		}

		// 4. Tarik data DetailPeminjaman secara manual (Aman dari error alias Include)
		const detailBarang = await DetailPeminjaman.findAll({
			where: { peminjaman_id: id },
			transaction: t,
		});

		// 5. KEMBALIKAN STOK: Iterasi setiap barang dalam detail
		if (detailBarang && detailBarang.length > 0) {
			for (const item of detailBarang) {
				const barangLokal = await Barang.findByPk(item.barang_id, {
					transaction: t,
				});

				if (barangLokal) {
					// Menambahkan kembali stok yang sebelumnya dikurangi (Hold)
					await barangLokal.increment("stok", {
						by: item.jumlah_pinjam,
						transaction: t,
					});
				}
			}
		}

		// 6. HAPUS DATA (Urutan anak lalu induk sangat krusial di PostgreSQL)

		// Hapus detailnya dulu (anak)
		await DetailPeminjaman.destroy({
			where: { peminjaman_id: id },
			transaction: t,
		});

		// Hapus data peminjaman utama (induk)
		await peminjaman.destroy({ transaction: t });

		// 7. Simpan semua perubahan (Commit)
		await t.commit();

		return res.status(200).json({
			status: "success",
			message:
				"Permohonan berhasil dibatalkan dan stok alat telah dikembalikan.",
		});
	} catch (error) {
		// Jika ada error (misal: UUID tidak valid), rollback dan tangkap errornya
		if (t) await t.rollback();
		console.error("❌ Error Batalkan Peminjaman:", error);

		return res.status(500).json({
			status: "error",
			message: "Terjadi kesalahan server saat membatalkan peminjaman.",
			error_detail: error.message, // Berguna untuk melihat pesan error asli dari Sequelize
		});
	}
};

// FUNGSI 4: UPDATE PEMINJAMAN (Hanya jika masih 'Menunggu')
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

		// --- PERBAIKAN FATAL: KEMBALIKAN STOK LAMA DULU ---
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

		// Hapus detail lama
		await DetailPeminjaman.destroy({
			where: { peminjaman_id: peminjaman.id },
			transaction: t,
		});

		// --- PERBAIKAN FATAL: POTONG STOK BARU SEKALIGUS VALIDASI ---
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

		// Update Data Induk
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

				tanggal_pinjam,
				tanggal_kembali,
			},
			{ transaction: t },
		);

		// Masukkan detail baru
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
