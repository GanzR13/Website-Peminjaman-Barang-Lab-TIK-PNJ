"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class LaporanMasalah extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// Relasi ke model Barang
			LaporanMasalah.belongsTo(models.Barang, {
				foreignKey: "barang_id",
				as: "barang",
			});

			LaporanMasalah.belongsTo(models.User, {
				foreignKey: "pelapor_id",
				as: "pelapor",
			});
			LaporanMasalah.belongsTo(models.Peminjaman, {
				foreignKey: "peminjaman_id",
				as: "peminjaman",
			});
		}
	}

	LaporanMasalah.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			barang_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "barang",
					key: "id",
				},
			},
			// SANGAT DISARANKAN: Tambahkan Foreign Key ke Peminjaman dan User
			peminjaman_id: {
				type: DataTypes.INTEGER,
				allowNull: true, // Bisa null jika misal admin nemu barang rusak di gudang (bukan dari peminjaman)
			},
			pelapor_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			// 1. KOLOM PEMBEDA UTAMA
			jenis_laporan: {
				type: DataTypes.ENUM("Kerusakan", "Kehilangan"),
				allowNull: false,
			},

			// 2. GABUNGAN JUMLAH (Menggantikan jumlah_rusak & jumlah_hilang)
			jumlah: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},

			// 3. GABUNGAN DESKRIPSI (Menggantikan deskripsi_kejadian & deskripsi_kerusakan)
			deskripsi: {
				type: DataTypes.TEXT,
				allowNull: false,
			},

			tanggal_kejadian: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},

			// Bisa dipakai untuk foto barang rusak ATAU foto tempat kosong (jika hilang)
			foto_bukti: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			// Menggantikan tindakan_perbaikan (Bisa berisi "Diservis" atau "Diminta ganti rugi uang")
			tindakan_penyelesaian: {
				type: DataTypes.TEXT,
				allowNull: true,
			},

			// 4. GABUNGAN STATUS ENUM
			status: {
				type: DataTypes.ENUM(
					"Menunggu Tindakan", // Status Default Baru
					"Dalam Penyelidikan", // Khusus Hilang
					"Dikonfirmasi Hilang", // Khusus Hilang
					"Sudah Diganti", // Khusus Hilang (Selesai)
					"Perlu Perbaikan", // Khusus Rusak
					"Sedang Diservis", // Khusus Rusak
					"Selesai Diperbaiki", // Khusus Rusak (Selesai)
					"Rusak Total", // Khusus Rusak (Selesai)
				),
				defaultValue: "Menunggu Tindakan",
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "LaporanMasalah",
			tableName: "laporan_masalah",
			freezeTableName: true,
			timestamps: true,
		},
	);

	return LaporanMasalah;
};
