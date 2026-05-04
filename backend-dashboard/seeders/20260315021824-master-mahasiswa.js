'use strict';
const { v4: uuidv4 } = require('uuid'); // Wajib import UUID

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Cari UUID milik user mahasiswa dari database berdasarkan emailnya
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "user" WHERE email = 'mahasiswa.tik@mhsw.pnj.ac.id';`
    );

    // Pastikan user ditemukan sebelum lanjut
    if (!users[0] || users[0].length === 0) {
      console.error("User mahasiswa tidak ditemukan! Pastikan seeder User dijalankan lebih dulu.");
      return;
    }

    const mahasiswaUserId = users[0][0].id; // Ambil string UUID-nya

    // 2. Masukkan data ke tabel mahasiswa
    await queryInterface.bulkInsert('mahasiswa', [
      {
        id: uuidv4(), // Generate UUID untuk tabel mahasiswa
        nama_mahasiswa: 'Budi Mahasiswa',
        nim: '4320070001',
        angkatan: 2023,
        user_id: mahasiswaUserId, // Masukkan UUID dari hasil query di atas
        prodi_id: 2, // Sesuai seeder Prodi
        kelas_id: 1, // Sesuai seeder Kelas
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mahasiswa', null, {});
  }
};