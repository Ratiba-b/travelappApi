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

/******************************************/
/** INITIALISATION DES TABLES */
const db = {};
db.sequelize = sequelize;
db.User = require("../models/user.model")(sequelize);
db.Cocktail = require("../models/cocktail.model")(sequelize);
db.Travel = require("../models/travel.model")(sequelize);
db.Planning = require("../models/planning.model")(sequelize);
db.Todo = require("../models/todo.model")(sequelize);

/**************************************/
/**MISE EN PLACE DES RELATIONS  */

db.User.hasMany(db.Cocktail, {
  foreignKey: "user_id",
  onDelete: "cascade",
});
db.User.hasMany(db.Travel, {
  foreignKey: "user_id",
  onDelete: "cascade",
});

db.Travel.hasOne(db.Planning, {
  foreignKey: "travel_id",
  onDelete: "cascade",
});
db.Travel.hasOne(db.Todo, {
  foreignKey: "travel_id",
  onDelete: "cascade",
});

db.Cocktail.belongsTo(db.User, { foreignKey: "user_id" });
db.Travel.belongsTo(db.User, { foreignKey: "user_id" });
db.Planning.belongsTo(db.Travel, { foreignKey: "travel_id" });
db.Todo.belongsTo(db.Travel, { foreignKey: "travel_id" });

// db.Travel.belongsTo(db.User, { foreignKey: "user_id" });
// db.Travel.hasOne(db.Planning, db.User, { foreignKey: "travel_id" });
// db.Planning.belongsTo(db.Travel, db.User, { foreignKey: "travel_id, user_id" });
// db.Planning.hasOne(db.Todo, { foreignKey: "planning_id" });
// db.Todo.belongs(db.Planning, db.User, { foreignKey: "planning_id, user_id" });

/*************************************/
/** SYNCHRONISATION DES MODELES */
// sequelize.sync((err) => {
//   console.log("Database sync error", err);
// });

db.sequelize.sync({ alter: true });
module.exports = db;
