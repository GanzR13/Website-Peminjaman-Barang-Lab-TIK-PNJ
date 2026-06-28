"use strict";

const {
	LaporanMasalah,
	Barang,
	User,
	Mahasiswa,
	Pegawai,
	sequelize,
} = require("../models");

const createAdminLog = require("../utils/adminActionLogger");

const getNumericTargetId = (id) => {
	const parsed = Number(id);
	return Number.isInteger(parsed) ? parsed : null;
};

const normalizeStatus = (value) => {
	return String(value || "").trim();
};

const getJumlahLaporan = (laporan) => {
	const jumlah = Number(laporan.jumlah || 1);
	return jumlah > 0 ? jumlah : 1;
};

exports.getAllLaporan = async (req, res) => {
	try {
		const laporanList = await LaporanMasalah.findAll({
			include: [
				{
					model: Barang,
					as: "barang",
					attributes: ["id", "nama_barang", "gambar", "stok"],
				},
				{
					model: User,
					as: "pelapor",
					attributes: ["id", "email"],
					include: [
						{
							model: Mahasiswa,
							as: "mahasiswa",
							attributes: ["nama_mahasiswa"],
						},
						{
							model: Pegawai,
							as: "pegawai",
							attributes: ["nama_lengkap"],
						},
					],
				},
			],
			order: [["createdAt", "DESC"]],
		});

		const mappedData = laporanList.map((item) => {
			const plain = item.get({ plain: true });
			let namaAsli = "User Terhapus";

			if (plain.pelapor) {
				if (plain.pelapor.mahasiswa) {
					namaAsli =
						plain.pelapor.mahasiswa.nama_mahasiswa ||
						plain.pelapor.mahasiswa.nama;
				} else if (plain.pelapor.pegawai) {
					namaAsli =
						plain.pelapor.pegawai.nama_lengkap ||
						plain.pelapor.pegawai.nama_pegawai ||
						plain.pelapor.pegawai.nama;
				}

				if (!namaAsli || String(namaAsli).trim() === "") {
					namaAsli = plain.pelapor.email;
				}
			}

			return {
				...plain,
				pelapor: {
					...plain.pelapor,
					nama_lengkap: namaAsli,
				},
			};
		});

		return res.status(200).json({
			status: "success",
			data: mappedData,
		});
	} catch (error) {
		console.error("Error Get All Laporan:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

exports.updateStatusLaporan = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;
		const {
			status,
			tindakan_penyelesaian,
			jumlah_proses,
		} = req.body;

		const statusBaru = String(status || "").trim();

		if (!statusBaru) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Status laporan wajib diisi.",
			});
		}

		const laporan = await LaporanMasalah.findByPk(id, {
			include: [
				{
					model: Barang,
					as: "barang",
					attributes: ["id", "nama_barang", "stok"],
				},
				{
					model: User,
					as: "pelapor",
					attributes: ["id", "email"],
					include: [
						{
							model: Mahasiswa,
							as: "mahasiswa",
							attributes: ["nama_mahasiswa"],
						},
						{
							model: Pegawai,
							as: "pegawai",
							attributes: ["nama_lengkap"],
						},
					],
				},
			],
			transaction: t,
		});

		if (!laporan) {
			await t.rollback();

			return res.status(404).json({
				status: "error",
				message: "Laporan tidak ditemukan.",
			});
		}

		if (!laporan.barang_id) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Laporan ini tidak memiliki barang terkait.",
			});
		}

		const barang = await Barang.findByPk(laporan.barang_id, {
			transaction: t,
		});

		if (!barang) {
			await t.rollback();

			return res.status(404).json({
				status: "error",
				message: "Barang pada laporan ini tidak ditemukan.",
			});
		}

		const laporanBefore = laporan.toJSON ? laporan.toJSON() : laporan;

		const statusLama = String(laporan.status || "").trim();
		const jumlahTotal = Number(laporan.jumlah || 1);
		const jumlahProses = Number(jumlah_proses || jumlahTotal);

		if (!Number.isInteger(jumlahProses) || jumlahProses < 1) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Jumlah unit yang diproses minimal 1.",
			});
		}

		if (jumlahProses > jumlahTotal) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: `Jumlah unit yang diproses tidak boleh melebihi total laporan (${jumlahTotal} unit).`,
			});
		}

		const jumlahSisa = jumlahTotal - jumlahProses;

		const namaBarang =
			laporanBefore.barang?.nama_barang ||
			barang.nama_barang ||
			`Barang ID ${laporan.barang_id}`;

		const namaPelapor =
			laporanBefore.pelapor?.mahasiswa?.nama_mahasiswa ||
			laporanBefore.pelapor?.pegawai?.nama_lengkap ||
			laporanBefore.pelapor?.email ||
			"User Terhapus";

		let stokBerubah = false;
		let tipePerubahanStok = null;
		let jumlahPerubahanStok = 0;
		let laporanSisaId = null;

		// Sudah Diganti:
		// Admin memberikan barang pengganti dari stok lab, maka stok berkurang sesuai jumlah yang diproses.
		if (statusLama !== "Sudah Diganti" && statusBaru === "Sudah Diganti") {
			const stokSaatIni = Number(barang.stok || 0);

			if (stokSaatIni < jumlahProses) {
				await t.rollback();

				return res.status(400).json({
					status: "error",
					message: `Stok ${namaBarang} tidak mencukupi untuk barang pengganti. Stok tersedia: ${stokSaatIni}, dibutuhkan: ${jumlahProses}.`,
				});
			}

			await Barang.decrement("stok", {
				by: jumlahProses,
				where: { id: laporan.barang_id },
				transaction: t,
			});

			stokBerubah = true;
			tipePerubahanStok = "STOK_PENGGANTI_KELUAR";
			jumlahPerubahanStok = -jumlahProses;
		}

		// Selesai Diperbaiki:
		// Barang rusak sudah selesai diperbaiki dan kembali ke stok.
		if (
			statusLama !== "Selesai Diperbaiki" &&
			statusBaru === "Selesai Diperbaiki"
		) {
			await Barang.increment("stok", {
				by: jumlahProses,
				where: { id: laporan.barang_id },
				transaction: t,
			});

			stokBerubah = true;
			tipePerubahanStok = "STOK_PERBAIKAN_KEMBALI";
			jumlahPerubahanStok = jumlahProses;
		}

		// Split Laporan:
		// Jika jumlah yang diproses lebih kecil dari total laporan, maka akan dibuat laporan baru untuk sisa unit.
		if (jumlahSisa > 0) {
			const dataSisa = laporanBefore;

			delete dataSisa.id;
			delete dataSisa.barang;
			delete dataSisa.pelapor;
			delete dataSisa.createdAt;
			delete dataSisa.updatedAt;

			const laporanSisa = await LaporanMasalah.create(
				{
					...dataSisa,
					jumlah: jumlahSisa,
					status: statusLama,
					tindakan_penyelesaian:
						laporan.tindakan_penyelesaian ||
						`Sisa ${jumlahSisa} unit masih dalam status ${statusLama}.`,
				},
				{ transaction: t },
			);

			laporanSisaId = laporanSisa.id;
		}

		await laporan.update(
			{
				jumlah: jumlahProses,
				status: statusBaru,
				tindakan_penyelesaian:
					tindakan_penyelesaian || laporan.tindakan_penyelesaian,
			},
			{ transaction: t },
		);

		await t.commit();

		await createAdminLog({
			req,
			action: "UPDATE_STATUS",
			module: "Laporan Masalah",
			description: `Mengubah status laporan ${namaBarang} dari ${statusLama} menjadi ${statusBaru}`,
			target_id: getNumericTargetId(laporan.id),
			metadata: {
				laporan_id: laporan.id,
				laporan_sisa_id: laporanSisaId,
				barang_id: laporan.barang_id,
				nama_barang: namaBarang,
				jumlah_total_sebelum: jumlahTotal,
				jumlah_diproses: jumlahProses,
				jumlah_sisa: jumlahSisa,
				pelapor_id: laporan.user_id || laporan.pelapor_id || null,
				nama_pelapor: namaPelapor,
				status_lama: statusLama,
				status_baru: statusBaru,
				tindakan_penyelesaian:
					tindakan_penyelesaian || laporan.tindakan_penyelesaian,
				stok_berubah: stokBerubah,
				tipe_perubahan_stok: tipePerubahanStok,
				jumlah_perubahan_stok: jumlahPerubahanStok,
			},
		});

		return res.status(200).json({
			status: "success",
			message:
				jumlahSisa > 0
					? `Status ${jumlahProses} unit berhasil diperbarui menjadi ${statusBaru}. Sisa ${jumlahSisa} unit tetap berstatus ${statusLama}.`
					: `Status laporan berhasil diperbarui menjadi: ${statusBaru}`,
			stok: {
				berubah: stokBerubah,
				tipe: tipePerubahanStok,
				jumlah: jumlahPerubahanStok,
			},
			split: {
				terjadi: jumlahSisa > 0,
				jumlah_diproses: jumlahProses,
				jumlah_sisa: jumlahSisa,
				laporan_sisa_id: laporanSisaId,
			},
		});
	} catch (error) {
		if (t) await t.rollback();

		console.error("Error Update Laporan:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
			detail: error.parent?.detail || error.original?.detail || null,
		});
	}
};