/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Todo = sequelize.define("Todo", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    travel_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },

    task: {
      type: DataTypes.STRING(100),
    },
  }));
};
