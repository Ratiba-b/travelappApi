/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const eventCtrl = require("../controllers/event.controller");
const { authJwt } = require("../Middlewares");

/***********************************************/
/** RECUPERATION DU ROUTEUR D'EXPRESS */
let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("AUTH time: ", event.toString());
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE USER */
router.get("/", [authJwt.verifyToken], eventCtrl.getAllEvents);

router.get("/:id", [authJwt.verifyToken], eventCtrl.getEventById);

router.put("", [authJwt.verifyToken], eventCtrl.addEvent);

router.patch("/:id", [authJwt.verifyToken], eventCtrl.updateEvent);

router.post("/untrash/:id", [authJwt.verifyToken], eventCtrl.untrashEvent);

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", [authJwt.verifyToken], eventCtrl.trashEvent);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", [authJwt.verifyToken], eventCtrl.destroyEvent);

module.exports = router;
