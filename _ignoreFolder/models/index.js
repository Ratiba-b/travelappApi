const config = require("../../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  // pool: {
  //   max: config.pool.max,
  //   min: config.pool.min,
  //   acquire: config.pool.acquire,
  //   idle: config.pool.idle,
  // },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../../models/user.model.js")(sequelize, Sequelize);
db.role = require("../../models/role.model.js")(sequelize, Sequelize);
db.tutorial = require("./tutorial.model.js")(sequelize, Sequelize);
db.travel = require("../../models/travel.model.js")(sequelize, Sequelize);
db.todo = require("../../models/todo.model.js")(sequelize, Sequelize);
db.planning = require("../../models/planning.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

// One user has many travels and A travel has A user
db.user.hasMany(db.travel, {
  as: "travels",
});

db.travel.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

//1 planning has A todo and 1 todo has A planning

db.todo.belongsTo(db.planning, {
  foreignKey: "planningId",
  as: "planning",
});

db.planning.belongsTo(db.todo, {
  foreignKey: "todoId",
  as: "todo",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
