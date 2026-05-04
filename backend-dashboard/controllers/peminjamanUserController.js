"use strict";

const {
	Peminjaman,
	DetailPeminjaman,
	Barang,
	sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.checkoutPeminjaman = async (req, res) => {
	// Memulai Database Transaction
	const t = await sequelize.transaction();

	try {
		const {
			kategori_kebutuhan,
			tujuan_peminjaman,
			nama_acara,
			organisasi_penyelenggara,
			dosen_penanggung_jawab,
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
					[Op.lt]: awalBesok
				}
			},
			order: [['antrian', 'DESC']],
			transaction: t
		});

		// Jika hari ini sudah ada transaksi, tambah 1. Jika belum, mulai dari 1.
		const nomorAntrianBaru = transaksiTerakhir && transaksiTerakhir.antrian 
			? transaksiTerakhir.antrian + 1 
			: 1;
		// -----------------------------------------------------

		// Simpan data ke tabel Induk (Peminjaman)
		const peminjamanBaru = await Peminjaman.create(
			{
				user_id,
				antrian: nomorAntrianBaru, // <-- Masukkan nomor antrian ke sini
				kategori_kebutuhan,
				tujuan_peminjaman,
				nama_acara: nama_acara || null,
				organisasi_penyelenggara: organisasi_penyelenggara || null,
				dosen_penanggung_jawab: dosen_penanggung_jawab || null,
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
		const user_id = req.user.id; // Dari JWT

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

		res.status(200).json({ status: "success", data: riwayat });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// FUNGSI 3: BATALKAN PEMINJAMAN (Hanya jika masih 'Menunggu')
exports.batalkanPeminjaman = async (req, res) => {
    // Memulai transaksi agar jika satu proses gagal, semua dibatalkan (aman)
    const t = await sequelize.transaction();

    try {
        const { id } = req.params; // ID Peminjaman dari URL
        const user_id = req.user.id; // ID User dari middleware auth

        // 1. Cari data peminjaman beserta detail barangnya
        const peminjaman = await Peminjaman.findOne({
            where: { id, user_id },
            include: [{ 
                model: DetailPeminjaman, 
                as: 'detail_barang' // Pastikan alias sesuai dengan model Peminjaman
            }],
            transaction: t
        });

        // 2. Validasi keberadaan data
        if (!peminjaman) {
            await t.rollback();
            return res.status(404).json({ 
                status: "error", 
                message: "Data peminjaman tidak ditemukan." 
            });
        }

        // 3. Validasi status (Hanya bisa batal jika masih 'Menunggu')
        if (peminjaman.status !== 'Menunggu') {
            await t.rollback();
            return res.status(400).json({ 
                status: "error", 
                message: "Peminjaman tidak dapat dibatalkan karena sedang/sudah diproses." 
            });
        }

        // 4. KEMBALIKAN STOK: Iterasi setiap barang dalam detail_barang
        if (peminjaman.detail_barang && peminjaman.detail_barang.length > 0) {
            for (const item of peminjaman.detail_barang) {
                const barangLokal = await Barang.findByPk(item.barang_id, { transaction: t });
                if (barangLokal) {
                    // Menambahkan kembali stok yang sebelumnya dikurangi saat meminjam
                    await barangLokal.increment('stok', { 
                        by: item.jumlah_pinjam, 
                        transaction: t 
                    });
                }
            }
        }

        // 5. HAPUS DATA (Urutan penting untuk menghindari Foreign Key Error)
        
        // Hapus detailnya dulu (anak)
        await DetailPeminjaman.destroy({
            where: { peminjaman_id: id }, // Menggunakan variabel 'id' yang sudah didefinisikan di atas
            transaction: t
        });

        // Hapus data peminjaman utama (induk)
        await peminjaman.destroy({ transaction: t });

        // 6. Simpan semua perubahan ke database
        await t.commit();

        res.status(200).json({ 
            status: "success", 
            message: "Permohonan berhasil dibatalkan dan stok telah dikembalikan." 
        });

    } catch (error) {
        // Jika ada error (seperti 'id is not defined' sebelumnya), batalkan semua proses
        if (t) await t.rollback();
        console.error("Error Detail Backend:", error);
        res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
};

// FUNGSI 4: UPDATE PEMINJAMAN (Hanya jika masih 'Menunggu')
exports.updatePeminjamanSaya = async (req, res) => {
	// Memulai Database Transaction karena kita akan mengupdate 2 tabel
	const t = await sequelize.transaction();

	try {
		const { id } = req.params; // ID Transaksi Peminjaman
		const user_id = req.user.id;

		const {
			kategori_kebutuhan,
			tujuan_peminjaman,
			nama_acara,
			organisasi_penyelenggara,
			dosen_penanggung_jawab,
			tanggal_pinjam,
			tanggal_kembali,
			keranjang_barang, // Array barang baru: [{ barang_id: 1, jumlah: 2 }, ...]
		} = req.body;

		// 1. Cari peminjaman milik user ini
		const peminjaman = await Peminjaman.findOne({
			where: { id, user_id },
		});

		// 2. Validasi Transaksi
		if (!peminjaman) {
			return res.status(404).json({
				status: "error",
				message: "Transaksi peminjaman tidak ditemukan.",
			});
		}

		if (peminjaman.status !== "Menunggu") {
			return res.status(400).json({
				status: "error",
				message:
					"Peminjaman tidak dapat diedit karena sudah diproses oleh Admin.",
			});
		}

		if (!keranjang_barang || keranjang_barang.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "Keranjang barang tidak boleh kosong!",
			});
		}

		// 3. Update Data Induk (Formulir Peminjaman)
		await peminjaman.update(
			{
				kategori_kebutuhan,
				tujuan_peminjaman,
				nama_acara: nama_acara || null,
				organisasi_penyelenggara: organisasi_penyelenggara || null,
				dosen_penanggung_jawab: dosen_penanggung_jawab || null,
				tanggal_pinjam,
				tanggal_kembali,
				// Status tetap dibiarkan "Menunggu"
			},
			{ transaction: t },
		);

		// 4. Update Keranjang (Tabel DetailPeminjaman)
		// Cara paling aman dan bersih: Hapus semua keranjang lama, lalu masukkan keranjang baru

		// 4a. Hapus detail lama
		await DetailPeminjaman.destroy({
			where: { peminjaman_id: peminjaman.id },
			transaction: t,
		});

		// 4b. Siapkan detail baru
		const detailDataBaru = keranjang_barang.map((item) => {
			return {
				peminjaman_id: peminjaman.id,
				barang_id: item.barang_id,
				jumlah_pinjam: item.jumlah,
				status_barang: "Dipinjam",
			};
		});

		// 4c. Masukkan detail baru (Bulk Insert)
		await DetailPeminjaman.bulkCreate(detailDataBaru, { transaction: t });

		// 5. Commit Transaksi
		await t.commit();

		res.status(200).json({
			status: "success",
			message: "Keranjang peminjaman berhasil diperbarui!",
		});
	} catch (error) {
		// Rollback jika terjadi error
		await t.rollback();
		res.status(500).json({ status: "error", message: error.message });
	}
};
