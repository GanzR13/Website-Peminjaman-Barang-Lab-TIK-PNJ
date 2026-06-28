"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class LaporanMasalah extends Model {

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
			
			peminjaman_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			pelapor_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			jenis_laporan: {
				type: DataTypes.ENUM("Kerusakan", "Kehilangan"),
				allowNull: false,
			},
			jumlah: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			deskripsi: {
				type: DataTypes.TEXT,
				allowNull: false,
			},

			tanggal_kejadian: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			foto_bukti: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			tindakan_penyelesaian: {
				type: DataTypes.TEXT,
				allowNull: true,
			},

			status: {
				type: DataTypes.ENUM(
					"Menunggu Tindakan", 
					"Dalam Penyelidikan",
					"Dikonfirmasi Hilang", 
					"Sudah Diganti", 
					"Perlu Perbaikan", 
					"Sedang Diservis",
					"Selesai Diperbaiki",
					"Rusak Total",
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
