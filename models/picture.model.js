/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Picture = sequelize.define("Picture", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    picture: {
      type: DataTypes.TEXT,
    },
  }));
};
