/***********************************************/
/** IMPORT DES MODULES */
const { DataTypes } = require("sequelize");

const bcrypt = require("bcrypt");

/***********************************************/
/** DEFINITION DU MODELE USER */
module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true, // Ici une valdation de données
        },
      },
      password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i, // ici une contrainte debut a la fin entre 0-9 et a-f et longeur 64 caracteres
      },
    },
    { paranoid: true } // ici pour faire du soft delete
  );

  User.beforeCreate(async (user, options) => {
    let hash = await bcrypt.hash(
      user.password,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
    user.password = hash;
    console.log(user);
  });

  User.checkPassword = async (password, originel) => {
    return await bcrypt.compare(password, originel);
  };

  return User;
};

/*************************************/
/** ancienne SYNCHRONISATION DES MODELES */
//User.sync();
//User.sync({ force: true });
// User.sync({ alter: true });
