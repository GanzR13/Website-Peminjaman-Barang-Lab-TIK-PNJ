"use strict";

const {
	LaporanMasalah,
	Barang,
	User,
	Mahasiswa,
	Pegawai,
	sequelize,
} = require("../models");

// 1. GET ALL LAPORAN
exports.getAllLaporan = async (req, res) => {
	try {
		const laporanList = await LaporanMasalah.findAll({
			include: [
				{
					model: Barang,
					as: "barang",
					attributes: ["id", "nama_barang", "gambar"],
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
						{ model: Pegawai, as: "pegawai", attributes: ["nama_lengkap"] },
					],
				},
			],
			order: [["createdAt", "DESC"]], // Urutkan dari yang paling baru
		});

		// Mapping nama pelapor agar rapi (Sama seperti logika di peminjaman admin)
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

		res.status(200).json({ status: "success", data: mappedData });
	} catch (error) {
		console.error("Error Get All Laporan:", error);
		res.status(500).json({ status: "error", message: error.message });
	}
};

// 2. UPDATE STATUS LAPORAN & KEMBALIKAN STOK JIKA SELESAI
exports.updateStatusLaporan = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, tindakan_penyelesaian } = req.body;

        const laporan = await LaporanMasalah.findByPk(id, { transaction: t });

        if (!laporan) {
            await t.rollback();
            return res.status(404).json({ status: 'error', message: 'Laporan tidak ditemukan' });
        }

        const statusLama = laporan.status;
        const statusBaru = status;

        // ==========================================
        // ALUR LOGIKA STOK BARANG RUSAK & SERVIS
        // ==========================================

        // 1. Admin memberikan unit pengganti ke mahasiswa (Stok Berkurang)
        if (statusLama === 'Menunggu Tindakan' && statusBaru === 'Perlu Perbaikan') {
            await Barang.decrement('stok', {
                by: laporan.jumlah,
                where: { id: laporan.barang_id },
                transaction: t
            });
        }
        
        // 2. Barang selesai diservis dan kembali ke lemari lab (Stok Bertambah)
        // (Dari status Rusak/Servis menjadi Selesai)
        if ((statusLama === 'Perlu Perbaikan' || statusLama === 'Sedang Diservis') && statusBaru === 'Selesai Diperbaiki') {
            await Barang.increment('stok', {
                by: laporan.jumlah,
                where: { id: laporan.barang_id },
                transaction: t
            });
        }

        // Catatan: 
        // Pergerakan dari "Perlu Perbaikan" <--> "Sedang Diservis" <--> "Rusak Total" 
        // TIDAK AKAN mengubah stok, karena barang fisiknya sedang tidak ada di dalam lemari.

        // Update data laporan
        await laporan.update({
            status: statusBaru,
            tindakan_penyelesaian: tindakan_penyelesaian || laporan.tindakan_penyelesaian
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ 
            status: 'success', 
            message: `Status laporan berhasil diperbarui menjadi: ${statusBaru}` 
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Error Update Laporan:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
