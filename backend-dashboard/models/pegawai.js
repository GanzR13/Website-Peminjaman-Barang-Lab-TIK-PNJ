"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Pegawai extends Model {
        static associate(models) {
            // Relasi: Pegawai milik satu User
            Pegawai.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        }
    }

    Pegawai.init(
        {
            // Tambahkan ID sebagai UUID agar konsisten dengan Mahasiswa
            id: {
                type: DataTypes.STRING, // atau DataTypes.UUID
                primaryKey: true,
                allowNull: false
            },
            nama_lengkap: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nip: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true // NIP harus unik
            },
            // PENTING: user_id harus STRING/UUID karena merujuk ke User.id yang UUID
            user_id: {
                type: DataTypes.STRING, 
                allowNull: false,
                unique: true // Satu user hanya boleh punya satu profil pegawai
            },
        },
        {
            sequelize,
            modelName: "Pegawai",
            tableName: "pegawai",
            freezeTableName: true,
            timestamps: true,
        },
    );

    return Pegawai;
};