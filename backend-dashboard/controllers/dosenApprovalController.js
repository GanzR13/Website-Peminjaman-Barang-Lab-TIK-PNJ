"use strict";

const {
	Peminjaman,
	DetailPeminjaman,
	Barang,
	User,
	Mahasiswa,
	Pegawai,
	sequelize,
} = require("../models");

exports.getApprovalPeminjamanDosen = async (req, res) => {
	try {
		const dosenUserId = req.user.id;

		const data = await Peminjaman.findAll({
			where: {
				dosen_pj_user_id: dosenUserId,
			},
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: User,
					as: "peminjam",
					attributes: ["id", "email", "no_telepon"],
					include: [
						{
							model: Mahasiswa,
							as: "mahasiswa",
							attributes: ["nama_mahasiswa", "nim"],
						},
						{
							model: Pegawai,
							as: "pegawai",
							attributes: ["nama_lengkap", "nip"],
						},
					],
				},
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

		const mappedData = data.map((item) => {
			const plain = item.get({ plain: true });

			return {
				...plain,
				nama_peminjam:
					plain.peminjam?.mahasiswa?.nama_mahasiswa ||
					plain.peminjam?.pegawai?.nama_lengkap ||
					plain.peminjam?.email ||
					"Peminjam",
				email_peminjam: plain.peminjam?.email || "-",
			};
		});

		return res.status(200).json({
			status: "success",
			data: mappedData,
		});
	} catch (error) {
		console.error("Error Get Approval Peminjaman Dosen:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal mengambil data approval dosen.",
			error: error.message,
		});
	}
};

exports.updateApprovalPeminjamanDosen = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;
		const { status, catatan_approval_dosen_pj } = req.body;

		const allowedStatus = ["Disetujui", "Ditolak"];

		if (!allowedStatus.includes(status)) {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Status approval dosen tidak valid.",
			});
		}

		const peminjaman = await Peminjaman.findOne({
			where: {
				id,
				dosen_pj_user_id: req.user.id,
			},
			transaction: t,
		});

		if (!peminjaman) {
			await t.rollback();

			return res.status(404).json({
				status: "error",
				message: "Data peminjaman tidak ditemukan atau bukan approval Anda.",
			});
		}

		if (peminjaman.status_approve_dosen_pj !== "Menunggu") {
			await t.rollback();

			return res.status(400).json({
				status: "error",
				message: "Approval peminjaman ini sudah diproses.",
			});
		}

		await peminjaman.update(
			{
				status_approve_dosen_pj: status,
				dosen_pj_approved_at: new Date(),
				catatan_approval_dosen_pj: catatan_approval_dosen_pj || null,
			},
			{ transaction: t }
		);

		await t.commit();

		return res.status(200).json({
			status: "success",
			message:
				status === "Disetujui"
					? "Peminjaman berhasil disetujui oleh dosen."
					: "Peminjaman berhasil ditolak oleh dosen.",
		});
	} catch (error) {
		await t.rollback();

		console.error("Error Update Approval Peminjaman Dosen:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal memproses approval dosen.",
			error: error.message,
		});
	}
};