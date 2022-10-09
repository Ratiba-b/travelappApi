/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const userCtrl = require("../controllers/user.controller");

/***********************************************/
/** RECUPERATION DU ROUTEUR D'EXPRESS */
let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("AUTH time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE USER */
router.get("/", userCtrl.getAllUsers);

router.get("/:id", userCtrl.getUser);

router.put("", userCtrl.addUser);

router.patch("/:id", userCtrl.updateUser);

router.post("/untrash/:id", userCtrl.untrashUser);

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", userCtrl.trashUser);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", userCtrl.deleteUser);

module.exports = router;
