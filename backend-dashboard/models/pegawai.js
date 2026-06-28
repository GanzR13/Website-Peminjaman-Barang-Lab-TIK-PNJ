"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Pegawai extends Model {
        static associate(models) {
            Pegawai.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        }
    }

    Pegawai.init(
        {
            id: {
                type: DataTypes.STRING, 
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
                unique: true 
            },
            user_id: {
                type: DataTypes.STRING, 
                allowNull: false,
                unique: true
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