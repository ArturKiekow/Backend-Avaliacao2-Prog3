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
            tableName: "locacoes",
        }
    );
    return this;
  }
    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: "cliente_id", as: "cliente" });
        this.belongsTo(models.Carro, { foreignKey: "carro_id", as: "carro" });
    }
}

export default Locacao;