/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const stepCtrl = require("../controllers/step.controller");
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
/** ROUTAGE DE LA RESSOURCE step */
router.get("/", [authJwt.verifyToken], stepCtrl.getAllSteps);

router.get("/:id", [authJwt.verifyToken], stepCtrl.getStepById);

router.put("", stepCtrl.addStep);

router.patch("/:id", [authJwt.verifyToken], stepCtrl.updateStep);

router.post("/untrash/:id", [authJwt.verifyToken], stepCtrl.untrashStep);

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", [authJwt.verifyToken], stepCtrl.trashStep);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", [authJwt.verifyToken], stepCtrl.destroyStep);

module.exports = router;
