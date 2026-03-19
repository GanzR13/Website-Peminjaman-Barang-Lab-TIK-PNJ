'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        nama_role: 'Kepala Laboratorium',
        level_akses: 'super_admin', // Super Admin
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_role: 'Ketua Pengelola Lab',
        level_akses: 'super_admin', // Super Admin juga!
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_role: 'Staff Pengelola Lab',
        level_akses: 'admin', // Admin biasa
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_role: 'Dosen',
        level_akses: 'peminjam', // Akses khusus peminjam
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_role: 'Mahasiswa',
        level_akses: 'peminjam', // Akses khusus peminjam
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};