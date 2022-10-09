/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

/***********************************************/
/** RECUPERATION DU ROUTEUR D'EXPRESS */
let router = express.Router();

/***********************************************/
/** MIDDLEWARE GENERAL POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("AUTH time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE AUTH */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // validation des donnees recues
  if (!email || !password) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  User.findOne({ where: { email: email }, raw: true })
    .then((user) => {
      if (user === null) {
        return res.status(401).json({ message: "This account does not exist" });
      }

      // verification du mot de passe user
      bcrypt
        .compare(password, user.password)
        .then((test) => {
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

          // jwt.sign({payload}, secret, duree)
        })
        .catch((err) => {
          res.status(500).json({ message: "login process failed", error: err });
        });
    })
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

module.exports = router;
