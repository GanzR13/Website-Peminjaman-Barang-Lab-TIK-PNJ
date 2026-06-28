'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mahasiswa', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      nama_mahasiswa: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nim: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      angkatan: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true, 
        references: { 
          model: 'user', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      prodi_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kelas_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('mahasiswa');
  }
};