'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('locacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data_inicio: {
        allowNull: false,
        type: Sequelize.DATE
      },
      data_fim: {
        allowNull: false,
        type: Sequelize.DATE
      },
      valor_total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      clienteId: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'clientes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false, 
      },
      carroId: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'carros',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('locacoes');
  }
};
