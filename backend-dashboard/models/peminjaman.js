'use strict';
// PERHATIAN: Tambahkan 'Op' di sini untuk fungsi pencarian berdasarkan rentang waktu
const { Model, Op } = require('sequelize'); 

module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    static associate(models) {
      // Relasi: 1 Peminjaman dimiliki oleh 1 User (Peminjam)
      Peminjaman.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'peminjam' 
      });
      
      // Relasi ke tabel pivot (DetailPeminjaman) untuk mencatat barang apa saja yang dipinjam
      // Peminjaman.hasMany(models.DetailPeminjaman, { foreignKey: 'peminjaman_id' });
    }
  }
  
  Peminjaman.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // ---> INI ATRIBUT ANTRIAN BARU <---
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
    // --- KHUSUS NON-AKADEMIK (Boleh Kosong) ---
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
    // --- WAKTU & STATUS ---
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
    
    // ---> LOGIKA RESET ANTRIAN HARIAN <---
    hooks: {
      beforeValidate: async (peminjaman, options) => {
        // 1. Tentukan rentang waktu hari ini (Jam 00:00:00 - 23:59:59)
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // 2. Cari data peminjaman terakhir pada hari ini
        const lastPeminjaman = await sequelize.models.Peminjaman.findOne({
          where: {
            createdAt: {
              [Op.between]: [startOfDay, endOfDay]
            }
          },
          order: [['antrian', 'DESC']] // Ambil nomor antrian paling besar
        });

        // 3. Set nomor antrian: Jika sudah ada antrian hari ini, tambah 1. Jika belum, mulai dari 1.
        peminjaman.antrian = lastPeminjaman && lastPeminjaman.antrian ? lastPeminjaman.antrian + 1 : 1;
      }
    }
  });
  
  return Peminjaman;
};