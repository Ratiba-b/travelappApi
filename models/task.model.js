/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Task = sequelize.define("Task", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    todo_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },

    task: {
      type: DataTypes.STRING(100),
    },
  }));
};
