'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cname: {
        type: Sequelize.STRING(120),
        allowNull: true
      },
      delivery: {
        type: Sequelize.INTEGER,
        defaultValue:'1',
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('p','c'),
        defaultValue:'p',
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING(220),
        allowNull: true
      },
      frameID: {
        type: Sequelize.INTEGER,
        defaultValue:'1',
        allowNull: true
      },
      price: {
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      contact: {
        type: Sequelize.STRING(120),
        allowNull: true
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};