import Sequelize, {Model} from "sequelize";

class Carro extends Model {
  static init(sequelize){
    super.init(
        {
          marca: Sequelize.STRING,
          modelo: Sequelize.STRING,
          ano: Sequelize.INTEGER,
          placa: Sequelize.STRING,
          disponivel: Sequelize.BOOLEAN
        },
        {
          sequelize,
          tableName: "carros",
        }
    );
    return this;
  }
}

export default Carro;