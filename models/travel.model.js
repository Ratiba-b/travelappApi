/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");
const DB = require("../config/db.config");

/***********************************************/
/** DEFINITION DU MODELE USER */
const Travel = DB.define(
  "Travel",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      defaultValue: "",
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: "",
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      defaultValue: "",
      allowNull: false,
    },
  },
  { paranoid: true } // ici pour faire du soft delete
);

/*************************************/
/** SYNCHRONISATION DES MODELES */
// Travel.sync();
// Travel.sync({ force: true });
// Travel.sync({ alter: true });

module.exports = Travel;
