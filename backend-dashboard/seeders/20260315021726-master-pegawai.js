'use strict';
const { v4: uuidv4 } = require('uuid'); // Wajib import UUID

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil data UUID user dari database berdasarkan email masing-masing
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "user" WHERE email IN (
        'kepalalab@pnj.ac.id', 
        'ketua@pnj.ac.id', 
        'staff@pnj.ac.id', 
        'dosen.tik@pnj.ac.id'
      );`
    );

    const userRows = users[0];

    if (!userRows || userRows.length === 0) {
      console.error("Data user pegawai tidak ditemukan! Pastikan seeder User sudah dijalankan.");
      return;
    }

    // Mapping pegawai
    const userMap = {};
    userRows.forEach(user => {
      userMap[user.email] = user.id;
    });

    // Masukkan data ke tabel pegawai dengan UUID
    await queryInterface.bulkInsert('pegawai', [
      {
        id: uuidv4(),
        nama_lengkap: 'Prof. Dr. Kepala Lab',
        nip: '197001012000031001',
        user_id: userMap['kepalalab@pnj.ac.id'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Budi Ketua Pengelola, M.Kom.',
        nip: '198002022010041002',
        user_id: userMap['ketua@pnj.ac.id'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Siti Staff Rajin, S.Kom.',
        nip: '199003032015052003',
        user_id: userMap['staff@pnj.ac.id'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Ir. Dosen TIK, M.T.',
        nip: '197504042005061004',
        user_id: userMap['dosen.tik@pnj.ac.id'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pegawai', null, {});
  }
};