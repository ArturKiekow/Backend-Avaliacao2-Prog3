import Sequelize, {Model} from "sequelize";

class Locacao extends Model {
  static init(sequelize){
    super.init(
        {
            data_inicio: Sequelize.DATE,
            data_fim: Sequelize.DATE,
            valor_total: Sequelize.DECIMAL
        },
        {
            sequelize,
        }
    );
    return this;
  }
    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: "clienteId", as: "cliente" });
        this.belongsTo(models.Carro, { foreignKey: "carroId", as: "carro" });
    }
}

export default Locacao;