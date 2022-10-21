const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Role = sequelize.define("Role", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
    },
  }));
};
