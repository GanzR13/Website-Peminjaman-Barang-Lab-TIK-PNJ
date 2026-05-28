'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom 'nomor_surat' ke tabel 'peminjaman'
    await queryInterface.addColumn('peminjaman', 'nomor_surat', {
      type: Sequelize.STRING(100),
      allowNull: true, // Boleh null karena nomor surat mungkin baru di-generate saat status disetujui
      unique: true,    // Mencegah ada nomor surat yang ganda di database
    });
  },

  async down (queryInterface, Sequelize) {
    // Menghapus kolom 'nomor_surat' jika migrasi di-rollback (di-undo)
    await queryInterface.removeColumn('peminjaman', 'nomor_surat');
  }
};