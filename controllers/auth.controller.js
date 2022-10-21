/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const jwt = require("jsonwebtoken");

const DB = require("../config/db.config");
const User = DB.User;
const ROLES = DB.ROLES;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE AUTH */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // validation des donnees recues
  if (!email || !password) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  try {
    //verification si le user existe
    let user = await User.findOne({ where: { email: email }, raw: true });
    if (user === null) {
      return res.status(401).json({ message: "This account does not exist" });
    }

    // verification du mot de passe user

    let test = await User.checkPassword(password, user.password);
    if (!test) {
      return res.status(401).json({ message: "Wrong password" });
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
