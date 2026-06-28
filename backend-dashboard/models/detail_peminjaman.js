'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetailPeminjaman extends Model {
    static associate(models) {
      
      DetailPeminjaman.belongsTo(models.Peminjaman, {
        foreignKey: "peminjaman_id",
        as: "peminjaman"
      });

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
    tableName: 'detail_peminjaman', 
    timestamps: true
  });

  return DetailPeminjaman;
};