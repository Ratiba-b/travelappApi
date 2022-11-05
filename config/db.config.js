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
db.Role = require("../models/role.model")(sequelize);
db.Event = require("../models/event.model")(sequelize);
db.Article = require("../models/article.model")(sequelize);
db.Task = require("../models/task.model")(sequelize);
// db.Picture = require("../models/picture.model")(sequelize);

/**************************************/
/**MISE EN PLACE DES RELATIONS  */
db.Role.belongsToMany(db.User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.User.belongsToMany(db.Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
db.User.hasMany(db.Cocktail, {
  foreignKey: "user_id",
  onDelete: "cascade",
});
db.User.hasMany(db.Travel, {
  foreignKey: "user_id",
  onDelete: "cascade",
});
db.User.hasMany(db.Article, {
  foreignKey: "user_id",
  onDelete: "cascade",
});

db.Planning.hasMany(db.Event, {
  foreignKey: "planning_id",
  onDelete: "cascade",
});

// db.Todo.hasMany(db.Task, {
//   foreignKey: "todo_id",
//   onDelete: "cascade",
// });

db.Travel.hasMany(db.Planning, {
  foreignKey: "travel_id",
  onDelete: "cascade",
});
db.Travel.hasMany(db.Todo, {
  foreignKey: "travel_id",
  onDelete: "cascade",
});
// db.Article.hasOne(db.Picture, {
//   foreignKey: "article_id",
//   onDelete: "cascade",
// });

db.Cocktail.belongsTo(db.User, { foreignKey: "user_id" });
db.Travel.belongsTo(db.User, { foreignKey: "user_id" });
db.Article.belongsTo(db.User, { foreignKey: "user_id" });
db.Planning.belongsTo(db.Travel, { foreignKey: "travel_id" });
db.Todo.belongsTo(db.Travel, { foreignKey: "travel_id" });
db.Event.belongsTo(db.Planning, { foreignKey: "planning_id" });
// db.Task.belongsTo(db.Todo, { foreignKey: "todo_id" });
// db.Picture.belongsTo(db.Article, { foreignKey: "article_id" });

db.ROLES = ["user", "admin", "pro"];
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

// db.sequelize.sync({ alter: true }).then(() => {
//   console.log("Drop and Resync Db");
//   // initial();
// });

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });

//   Role.create({
//     id: 2,
//     name: "pro",
//   });

//   Role.create({
//     id: 3,
//     name: "admin",
//   });
//}
module.exports = db;
