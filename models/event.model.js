/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Event = sequelize.define("Event", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    planning_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
    },

    start: {
      type: DataTypes.DATE,
    },
    end: {
      type: DataTypes.DATE,
    },
    allDay: {
      type: DataTypes.BOOLEAN,
    },
  }));
};
