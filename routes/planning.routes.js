/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const Planning = DB.Planning;
const Travel = DB.Travel;

let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("Cocktail time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE COCKTAIL */
router.get("/");
router.get("/:id");

router.put("/add");
router.patch("/update");

router.post("/untrash");
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id");

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id");
module.exports = router;
