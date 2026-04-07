'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    static associate(models) {
      // Relasi antar tabel akan didefinisikan di sini nantinya
      // Contoh: Barang.hasMany(models.Peminjaman, { foreignKey: 'barang_id' })
    }
  }
  
  Barang.init({
    kode_barang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Kode barang tidak boleh ada yang sama
    },
    nama_barang: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kondisi: {
      type: DataTypes.STRING,
      defaultValue: 'Baik'
    },
    deskripsi: {
      type: DataTypes.TEXT, // Menggunakan TEXT karena deskripsi bisa sangat panjang
      allowNull: true
    },
    gambar: {
      type: DataTypes.STRING, // Hanya menyimpan URL gambar
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Barang',
    tableName: 'barang',
    freezeTableName: true 
  });
  
  return Barang;
};