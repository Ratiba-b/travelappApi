/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Event = sequelize.define("StepsTravel", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    travel_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
    },
    details: {
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
