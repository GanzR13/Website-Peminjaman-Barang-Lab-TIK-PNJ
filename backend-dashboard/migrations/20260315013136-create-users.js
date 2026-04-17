'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true, // <-- Mencegah email kembar terdaftar dua kali
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      no_telepon: {
        type: Sequelize.STRING
      },
      tanggal_daftar: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW // Atau bisa pakai Sequelize.literal('CURRENT_TIMESTAMP')
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles', // <-- Merujuk ke nama tabel Roles
          key: 'id'       // <-- Merujuk ke kolom id di tabel Roles
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // <-- Mencegah Role dihapus jika masih ada User yang memakainya
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};