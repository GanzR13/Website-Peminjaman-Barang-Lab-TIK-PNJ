"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Mahasiswa extends Model {
        static associate(models) {
            // Relasi: Mahasiswa milik satu User
            Mahasiswa.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
            
            // Relasi ke tabel Referensi
            Mahasiswa.belongsTo(models.ref_Prodi, {
                foreignKey: "prodi_id",
                as: "prodi",
            });
            Mahasiswa.belongsTo(models.ref_Kelas, {
                foreignKey: "kelas_id",
                as: "kelas",
            });
        }
    }

    Mahasiswa.init(
        {
            // 1. Tambahkan ID eksplisit sebagai STRING/UUID
            id: {
                type: DataTypes.STRING, // atau DataTypes.UUID
                primaryKey: true,
                allowNull: false
            },
            nama_mahasiswa: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nim: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true // NIM tidak boleh ada yang sama
            },
            angkatan: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // 2. UBAH user_id MENJADI STRING agar cocok dengan UUID di tabel User
            user_id: {
                type: DataTypes.STRING, 
                allowNull: false,
                unique: true // Satu user hanya boleh punya satu profil mahasiswa
            },
            prodi_id: {
                type: DataTypes.INTEGER, // Tetap Integer jika tabel ref_Prodi pakai ID angka
                allowNull: false
            },
            kelas_id: {
                type: DataTypes.INTEGER, // Tetap Integer jika tabel ref_Kelas pakai ID angka
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: "Mahasiswa",
            tableName: "mahasiswa",
            freezeTableName: true,
            timestamps: true,
        },
    );

    return Mahasiswa;
};