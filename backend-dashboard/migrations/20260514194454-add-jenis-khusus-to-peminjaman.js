'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom 'jenis_khusus' ke tabel 'peminjaman'
    await queryInterface.addColumn('peminjaman', 'jenis_khusus', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Menghapus kolom jika migrasi di-undo / rollback
    await queryInterface.removeColumn('peminjaman', 'jenis_khusus');
  }
};