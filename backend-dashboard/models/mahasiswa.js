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
            //UUID
            id: {
                type: DataTypes.STRING,
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
                unique: true
            },
            angkatan: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            user_id: {
                type: DataTypes.STRING, 
                allowNull: false,
                unique: true 
            },
            prodi_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            kelas_id: {
                type: DataTypes.INTEGER,
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