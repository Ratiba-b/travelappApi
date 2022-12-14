/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const userCtrl = require("../controllers/user.controller");
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
router.get(
  "/",
  [authJwt.verifyToken, authJwt.isPro],
  userCtrl.findClientsbyUser
);

router.get("/:id", [authJwt.verifyToken], userCtrl.getUser);

router.put("", userCtrl.addUser);

router.patch("/:id", [authJwt.verifyToken], userCtrl.updateUser);

router.post(
  "/untrash/:id",
  [authJwt.verifyToken, authJwt.isPro],
  userCtrl.untrashUser
);

/************************* */
/** METTRE A LA POUBELLE*/
router.delete(
  "/trash/:id",
  [authJwt.verifyToken, authJwt.isPro],
  userCtrl.trashUser
);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isPro],
  userCtrl.deleteUser
);

module.exports = router;
