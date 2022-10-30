/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const checkTokenMiddleware = require("../_ignoreFolder/check");
const cocktailsCtrl = require("../controllers/cocktails.controller");

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
/** ROUTAGE DE LA RESSOURCE COCKTAIL */
router.get("/", cocktailsCtrl.getAllCocktails);

router.get("/:id", cocktailsCtrl.getCocktail);

router.put("", checkTokenMiddleware, cocktailsCtrl.addCocktail);

router.patch("/:id", checkTokenMiddleware, cocktailsCtrl.updateCocktail);

router.post(
  "/untrash/:id",
  checkTokenMiddleware,
  cocktailsCtrl.untrashCocktail
);

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", checkTokenMiddleware, cocktailsCtrl.trashCocktail);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", checkTokenMiddleware, cocktailsCtrl.deleteCocktail);

module.exports = router;
