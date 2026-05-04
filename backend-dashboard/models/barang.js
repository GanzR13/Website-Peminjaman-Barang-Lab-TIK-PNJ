"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Barang extends Model {
		static associate(models) {
			Barang.hasMany(models.LaporanKerusakan, {
				foreignKey: "barang_id",
				as: "riwayat_kerusakan",
			});

			Barang.hasMany(models.DetailPeminjaman, {
				foreignKey: "barang_id",
				as: "riwayat_peminjaman",
			});

			Barang.hasMany(models.LaporanKehilangan, {
				foreignKey: "barang_id",
				as: "riwayat_kehilangan",
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
				type: DataTypes.TEXT, // Menggunakan TEXT karena deskripsi bisa sangat panjang
				allowNull: true,
			},
			gambar: {
				type: DataTypes.STRING, // Hanya menyimpan URL gambar
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: true, // Mengizinkan kolom ini kosong saat data di-import
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true, // Mengizinkan kolom ini kosong saat data di-import
			},
		},
		{
			sequelize,
			modelName: "Barang",
			tableName: "barang",
			freezeTableName: true, // Memaksa nama tabel menjadi 'barang' (tanpa tambahan 's')
		},
	);

	return Barang;
};
