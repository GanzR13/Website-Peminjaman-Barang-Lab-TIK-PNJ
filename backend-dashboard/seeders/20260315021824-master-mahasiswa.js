'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Mahasiswa', [
      {
        nama_mahasiswa: 'Budi Mahasiswa',
        nim: '4320070001',
        angkatan: 2023,
        user_id: 5, // Terhubung ke akun Mahasiswa
        prodi_id: 2, // Mengacu ke Teknik Informatika di seeder Prodi
        kelas_id: 1, // Mengacu ke TI 1A (jika sesuai urutan seeder looping sebelumnya)
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Mahasiswa', null, {});
  }
};