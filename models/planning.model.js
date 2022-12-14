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

    start: {
      type: DataTypes.DATE,
    },
    end: {
      type: DataTypes.DATE,
    },
    description: {
      type: DataTypes.STRING(100),
    },
    location: {
      type: DataTypes.STRING(100),
    },
    hourStart: {
      type: DataTypes.STRING(100),
    },
    hourEnd: {
      type: DataTypes.STRING(100),
    },
  }));
};
