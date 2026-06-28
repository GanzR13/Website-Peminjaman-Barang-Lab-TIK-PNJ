'use strict';
const { v4: uuidv4 } = require('uuid'); // Wajib import UUID

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Cari UUID milik user mahasiswa dari database berdasarkan emailnya
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "user" WHERE email = 'mahasiswa.tik@mhsw.pnj.ac.id';`
    );

    if (!users[0] || users[0].length === 0) {
      console.error("User mahasiswa tidak ditemukan! Pastikan seeder User dijalankan lebih dulu.");
      return;
    }

    const mahasiswaUserId = users[0][0].id; // Ambil string UUID-nya

    // Masukkan data ke tabel mahasiswa
    await queryInterface.bulkInsert('mahasiswa', [
      {
        id: uuidv4(), 
        nama_mahasiswa: 'Budi Mahasiswa',
        nim: '4320070001',
        angkatan: 2023,
        user_id: mahasiswaUserId,
        prodi_id: 2, 
        kelas_id: 1, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mahasiswa', null, {});
  }
};