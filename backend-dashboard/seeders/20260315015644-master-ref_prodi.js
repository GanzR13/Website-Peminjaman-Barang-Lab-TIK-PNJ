'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ref_prodi', [
      {
        id: 1,
        nama_prodi: "Teknik Informatika",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nama_prodi: "Teknik Multimedia dan Jaringan",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nama_prodi: "Teknik Multimedia Digital",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nama_prodi: "Teknik Komputer dan Jaringan",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ref_prodi', null, {});
  }
};