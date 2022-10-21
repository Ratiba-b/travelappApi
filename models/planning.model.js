/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Planning = sequelize.define("Planning", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    travel_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
    },

    event: {
      type: DataTypes.STRING(100),
    },
    start: {
      type: DataTypes.DATE,
    },
    end: {
      type: DataTypes.DATE,
    },
  }));
};
