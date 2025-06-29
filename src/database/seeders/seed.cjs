"use strict";
const fs = require("fs");
const path = require("path");

module.exports = {
  async up (queryInterface, Sequelize) {
    const jsonPath = path.join(__dirname, "..", "..", "data", "locadora.json");
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(jsonData);
    const { clientes, carros, locacoes } = data;
    
    clientes.map(cliente => {
        cliente.createdAt = new Date();
        cliente.updatedAt = new Date();
        return cliente;
      });
    await queryInterface.bulkInsert("Clientes", clientes, {});

    carros.map(carro => {
        carro.createdAt = new Date();
        carro.updatedAt = new Date();
        return carro;
      });
    await queryInterface.bulkInsert("Carros", carros, {});

    locacoes.map(locacao => {
        let [ dia, mes, ano ] = locacao.data_inicio.split("-");
        locacao.data_inicio = `${ano}-${mes}-${dia}`;
        
        [ dia, mes, ano ] = locacao.data_fim.split("-");
        locacao.data_fim = `${ano}-${mes}-${dia}`;

        locacao.createdAt = new Date();
        locacao.updatedAt = new Date();
        return locacao;
      });
    await queryInterface.bulkInsert("Locacoes", locacoes, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clientes", null, {});
    await queryInterface.bulkDelete("Carros", null, {});
    await queryInterface.bulkDelete("Locacoes", null, {});
  }
};

