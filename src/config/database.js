const databaseConfig = {
  dialect: "mysql",
  host: "localhost",
  username: "user",
  password: "12345678",
  database: "locadora",
  define: {
    timestamps: true,
    underscored: false,
    underscoredAll: false,
    freezeTableName: true,
  },
};

export default databaseConfig;