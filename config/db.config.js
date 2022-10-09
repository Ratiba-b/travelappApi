/*************************************/
/** IMPORT DES MODULES */
const { Sequelize } = require("sequelize");

/*************************************/
/** CONNEXION A LA BASE DE DONNEES */
let sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

/**************************************/
/**MISE EN PLACE DES RELATIONS  */
const db = {};
db.sequelize = sequelize;
db.User = require("../models/user.model")(sequelize);
db.Cocktail = require("../models/cocktail.model")(sequelize);

db.User.hasMany(db.Cocktail, { foreignKey: "user_id", onDelete: "cascade" });
db.Cocktail.belongsTo(db.User, { foreignKey: "user_id" });

/*************************************/
/** SYNCHRONISATION DES MODELES */
// sequelize.sync((err) => {
//   console.log("Database sync error", err);
// });

db.sequelize.sync({ alter: true });
module.exports = db;
