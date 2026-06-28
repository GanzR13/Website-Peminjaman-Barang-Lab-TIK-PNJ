'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Mengubah nama kolom dari nomor_surat menjadi kode_peminjaman
    await queryInterface.renameColumn('peminjaman', 'nomor_surat', 'kode_peminjaman');
  },

  down: async (queryInterface, Sequelize) => {
    // Mengembalikan nama kolom dari kode_peminjaman menjadi nomor_surat
    await queryInterface.renameColumn('peminjaman', 'kode_peminjaman', 'nomor_surat');
  }
};