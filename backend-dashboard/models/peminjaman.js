'use strict';
const { Model, Op } = require('sequelize'); // Pastikan ini tidak error, jika error gunakan: const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    static associate(models) {
      Peminjaman.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'peminjam' 
      });
      
      Peminjaman.hasMany(models.DetailPeminjaman, {
        foreignKey: 'peminjaman_id',
        as: 'detail_barang',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  
  Peminjaman.init({
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    antrian: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kategori_kebutuhan: {
      type: DataTypes.ENUM('Akademik', 'Non-Akademik'),
      allowNull: false
    },
    tujuan_peminjaman: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nama_acara: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organisasi_penyelenggara: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dosen_penanggung_jawab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal_pinjam: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tanggal_kembali: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Menunggu', 'Disetujui', 'Dipinjam', 'Ditolak', 'Selesai'),
      defaultValue: 'Menunggu'
    },
    catatan_admin: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Peminjaman',
    tableName: 'peminjaman',
    freezeTableName: true,
  });
  
  return Peminjaman;
};