'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom 'nomor_surat' ke tabel 'peminjaman'
    await queryInterface.addColumn('peminjaman', 'nomor_surat', {
      type: Sequelize.STRING(100),
      allowNull: true, 
      unique: true,   
    });
  },

  async down (queryInterface, Sequelize) {
    // Menghapus kolom 'nomor_surat' jika migrasi di-rollback (di-undo)
    await queryInterface.removeColumn('peminjaman', 'nomor_surat');
  }
};