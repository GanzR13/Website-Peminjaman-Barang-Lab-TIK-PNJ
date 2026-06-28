"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Barang extends Model {
		static associate(models) {

			Barang.hasMany(models.DetailPeminjaman, {
				foreignKey: "barang_id",
				as: "riwayat_peminjaman",
			});
			
			Barang.hasMany(models.LaporanMasalah, {
				foreignKey: "barang_id",
				as: "laporan_masalah",
			});
		}
	}

	Barang.init(
		{
			nama_barang: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			stok: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			deskripsi: {
				type: DataTypes.TEXT, 
				allowNull: true,
			},
			gambar: {
				type: DataTypes.STRING, // Hanya menyimpan URL gambar
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Barang",
			tableName: "barang",
			freezeTableName: true,
		},
	);

	return Barang;
};
