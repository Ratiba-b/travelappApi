/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const authCtrl = require("../controllers/auth.controller");

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
router.post("/login", authCtrl.login);

module.exports = router;
