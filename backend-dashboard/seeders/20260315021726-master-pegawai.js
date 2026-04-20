'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pegawai', [
      {
        nama_lengkap: 'Prof. Dr. Kepala Lab',
        nip: '197001012000031001',
        user_id: 1, // Terhubung ke akun Kepala Lab
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lengkap: 'Budi Ketua Pengelola, M.Kom.',
        nip: '198002022010041002',
        user_id: 2, // Terhubung ke akun Ketua Pengelola
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lengkap: 'Siti Staff Rajin, S.Kom.',
        nip: '199003032015052003',
        user_id: 3, // Terhubung ke akun Staff
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lengkap: 'Ir. Dosen TIK, M.T.',
        nip: '197504042005061004',
        user_id: 4, // Terhubung ke akun Dosen
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pegawai', null, {});
  }
};