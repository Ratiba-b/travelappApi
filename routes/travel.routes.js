/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const { authJwt } = require("../Middlewares");
const travelCtrl = require("../controllers/travel.controller");

const cocktailsCtrl = require("../controllers/cocktails.controller");
const DB = require("../config/db.config");
const Travel = DB.Travel;
const User = DB.User;
/***********************************************/
/** RECUPERATION DU ROUTEUR D'EXPRESS */
let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("Cocktail time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE TRAVELS */
router.get("/", [authJwt.verifyToken], travelCtrl.getAllTravels);

router.get("/:id", [authJwt.verifyToken], travelCtrl.getTravelById);

router.put("", [authJwt.verifyToken], travelCtrl.addTravel);

router.patch("/update/:id", [authJwt.verifyToken], travelCtrl.updateTravel);

router.post("/untrash/:id", [authJwt.verifyToken], travelCtrl.untrashTravel);

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", [authJwt.verifyToken], travelCtrl.trashTravel);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/delete/:id", [authJwt.verifyToken], travelCtrl.destroyTravel);
module.exports = router;
