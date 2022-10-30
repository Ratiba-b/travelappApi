/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const { authJwt } = require("../Middlewares");
const planningCtrl = require("../controllers/planning.controller");

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
router.get("/", [authJwt.verifyToken], planningCtrl.getAllPlannings);
router.get("/:id", [authJwt.verifyToken], planningCtrl.getPlanningById);

router.put("", [authJwt.verifyToken], planningCtrl.addPlanning);
router.patch("/update", planningCtrl.updatePlanning);

router.post("/untrash", [authJwt.verifyToken], planningCtrl.untrashPlanning);
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", [authJwt.verifyToken], planningCtrl.trashPlanning);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", [authJwt.verifyToken], planningCtrl.destroyPlanning);
module.exports = router;
