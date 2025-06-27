import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";
import Carro from "../models/Carro.js";
import Cliente from "../models/Cliente.js";
import Locacao from "../models/Locacao.js";


const models = [Carro, Cliente, Locacao];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Faz a conexão com o BD
    this.connection = new Sequelize(databaseConfig);

    // Carrega os models e associaçoes com map
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
