'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetailPeminjaman extends Model {
    static associate(models) {
      // Relasi ke Peminjaman
      DetailPeminjaman.belongsTo(models.Peminjaman, {
        foreignKey: "peminjaman_id",
        as: "peminjaman"
      });

      // Relasi ke Barang - Pastikan models.Barang (Huruf Besar) 
      // merujuk ke modelName yang ada di Barang.js
      DetailPeminjaman.belongsTo(models.Barang, {
        foreignKey: "barang_id",
        as: "barang"
      });
    }
  }

  DetailPeminjaman.init({
    peminjaman_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    barang_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah_pinjam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'DetailPeminjaman',
    tableName: 'detail_peminjaman', // Huruf kecil sesuai database
    timestamps: true
  });

  return DetailPeminjaman;
};