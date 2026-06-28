'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pegawai', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      nama_lengkap: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nip: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true 
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
    await queryInterface.dropTable('pegawai');
  }
};