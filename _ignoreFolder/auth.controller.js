/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

const DB = require("../config/db.config");
const User = DB.User;
const ROLES = DB.ROLES;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE AUTH */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // validation des donnees recues
  if (!username || !password) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  try {
    //verification si le user existe
    let user = await User.findOne({ where: { username: username }, raw: true });
    if (user === null) {
      return res.status(401).json({ message: "This account does not exist" });
    }

    // verification du mot de passe user

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    // GENERATION DU TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_DURING }
    );
    let authorities = [];
    let roles = user.getRoles();
    console.log(user.getRoles());
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    return res.json({ access_token: token });
  } catch (err) {
    if (err.name === "SequelizeDatabaseError") {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res
      .status(500)
      .json({ message: "login process failed", error: err });
  }
};
