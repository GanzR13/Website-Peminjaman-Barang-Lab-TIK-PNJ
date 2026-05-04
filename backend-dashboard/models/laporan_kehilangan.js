'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LaporanKehilangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi ke model Barang
      // Menggunakan alias 'barang' agar sesuai dengan query di controller
      LaporanKehilangan.belongsTo(models.Barang, {
        foreignKey: "barang_id",
        as: "barang",
      });
    }
  }

  LaporanKehilangan.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    barang_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "barang", // Merujuk ke tableName fisik
        key: "id",
      },
    },
    jumlah_hilang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    deskripsi_kejadian: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tanggal_kejadian: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Dalam Penyelidikan", "Dikonfirmasi Hilang", "Sudah Diganti"),
      defaultValue: "Dalam Penyelidikan",
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "LaporanKehilangan",
    tableName: "laporan_kehilangan",
    freezeTableName: true,
    timestamps: true,
  });

  return LaporanKehilangan;
}