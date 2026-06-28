"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Peminjaman extends Model {
		static associate(models) {
			Peminjaman.belongsTo(models.User, {
				foreignKey: "user_id",
				as: "peminjam",
			});

			Peminjaman.hasMany(models.DetailPeminjaman, {
				foreignKey: "peminjaman_id",
				as: "detail_barang",
				onDelete: "CASCADE",
				hooks: true,
			});
			Peminjaman.hasMany(models.LaporanMasalah, {
				foreignKey: "peminjaman_id",
				as: "laporan_masalah",
			});
		}
	}

	Peminjaman.init(
		{
			user_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			antrian: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			kategori_kebutuhan: {
				type: DataTypes.ENUM("Harian", "Khusus"),
				allowNull: false,
			},
			jenis_khusus: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			tujuan_peminjaman: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			nama_acara: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			kode_peminjaman: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			file_surat_url: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			file_surat_drive_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			organisasi_penyelenggara: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			dosen_penanggung_jawab: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			nip_dosen_pj: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status_approve_kalab: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Menunggu",
			},

			kalab_approved_by: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			kalab_approved_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			dosen_pj_user_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			status_approve_dosen_pj: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Tidak Diperlukan",
			},

			dosen_pj_approved_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			file_surat_url: {
				type: DataTypes.TEXT,
				allowNull: true,
			},

			file_surat_drive_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			tanggal_pinjam: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			tanggal_kembali: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("Menunggu", "Dipinjam", "Ditolak", "Selesai"),
				defaultValue: "Menunggu",
			},
			catatan_admin: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Peminjaman",
			tableName: "peminjaman",
			freezeTableName: true,
		},
	);

	return Peminjaman;
};
