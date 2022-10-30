/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Article = sequelize.define("Article", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(100),
    },
    location: {
      type: DataTypes.STRING(100),
    },

    description: {
      type: DataTypes.TEXT,
    },

    picture: {
      type: DataTypes.TEXT,
    },
  }));
};
