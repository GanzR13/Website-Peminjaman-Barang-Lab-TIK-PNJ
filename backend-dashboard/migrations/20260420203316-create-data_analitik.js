'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('data_analitik', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
      },
      tanggal_pencatatan: {
        type: Sequelize.DATEONLY, allowNull: false
      },
      // Kolom Utama Untuk Data Analitik
      total_inventaris_global: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_barang_tersedia: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_barang_dipinjam: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_barang_rusak: { type: Sequelize.INTEGER, defaultValue: 0 },
      jumlah_peminjaman_hari_ini: { type: Sequelize.INTEGER, defaultValue: 0 },
      jumlah_pengembalian_hari_ini: { type: Sequelize.INTEGER, defaultValue: 0 },
      
      skor_popularitas: { 
        type: Sequelize.FLOAT, defaultValue: 0,
        comment: 'Dihitung dari frekuensi peminjaman relatif terhadap barang lain'
      },
      laju_penyusutan: { 
        type: Sequelize.FLOAT, defaultValue: 0,
        comment: 'Rata-rata barang rusak + hilang dalam periode tertentu'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('data_analitik');
  }
};