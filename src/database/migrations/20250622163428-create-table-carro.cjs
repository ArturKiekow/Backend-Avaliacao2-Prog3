'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('carros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      placa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      disponivel: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('carros');
  }
};
