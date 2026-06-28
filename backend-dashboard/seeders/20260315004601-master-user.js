'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);
    
    await queryInterface.bulkInsert('user', [
      {
        id: uuidv4(), // Generate UUID otomatis
        email: 'kepalalab@pnj.ac.id',
        password: hashedPassword,
        no_telepon: '081234567890',
        tanggal_daftar: new Date(),
        email_verified: true,
        role_id: 1, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'ketua@pnj.ac.id',
        password: hashedPassword,
        no_telepon: '081234567891',
        tanggal_daftar: new Date(),
        email_verified: true,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'staff@pnj.ac.id',
        password: hashedPassword,
        no_telepon: '081234567892',
        tanggal_daftar: new Date(),
        email_verified: true,
        role_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'dosen.tik@pnj.ac.id',
        password: hashedPassword,
        no_telepon: '081234567893',
        tanggal_daftar: new Date(),
        email_verified: true,
        role_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'mahasiswa.tik@mhsw.pnj.ac.id',
        password: hashedPassword,
        no_telepon: '081234567894',
        tanggal_daftar: new Date(),
        email_verified: true,
        role_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};