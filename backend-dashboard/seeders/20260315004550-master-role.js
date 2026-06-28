'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role', [
      {
        id: 1,
        nama_role: 'Kepala Laboratorium',
        level_akses: 'super_admin', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nama_role: 'Ketua Pengelola Lab',
        level_akses: 'super_admin', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nama_role: 'Staff Pengelola Lab',
        level_akses: 'admin', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nama_role: 'Dosen',
        level_akses: 'peminjam', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        nama_role: 'Mahasiswa',
        level_akses: 'peminjam', 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
};