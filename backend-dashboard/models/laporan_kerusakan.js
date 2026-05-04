'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LaporanKerusakan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Menghubungkan ke model Barang
      // Gunakan models.Barang (Huruf Besar sesuai modelName)
      LaporanKerusakan.belongsTo(models.Barang, {
        foreignKey: "barang_id",
        as: "barang",
      });
    }
  }

  LaporanKerusakan.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    barang_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // References di sini sebaiknya merujuk ke tableName fisik
      references: {
        model: "barang", 
        key: "id",
      },
    },
    jumlah_rusak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    deskripsi_kerusakan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    foto_kerusakan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tindakan_perbaikan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Perlu Perbaikan", "Sedang Diservis", "Selesai Diperbaiki", "Rusak Total"),
      defaultValue: "Perlu Perbaikan",
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'LaporanKerusakan',
    tableName: "laporan_kerusakan",
    freezeTableName: true,
    timestamps: true,
  });

  return LaporanKerusakan;
};