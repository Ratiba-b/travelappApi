/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

/***********************************************/
/** DEFINITION DU MODELE USER */
module.exports = (sequelize) => {
  return (Travel = sequelize.define(
    "Travel",
    {
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
        defaultValue: "",
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(100),
        defaultValue: "",
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,

        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,

        allowNull: false,
      },
    },
    { paranoid: true } // ici pour faire du soft delete
  ));
};

/*************************************/
/** SYNCHRONISATION DES MODELES */
// Travel.sync();
//Travel.sync({ force: true });
// Travel.sync({ alter: true });
