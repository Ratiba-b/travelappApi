/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const TodoCtrl = require("../controllers/todo.controller");
const { authJwt } = require("../Middlewares");


let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("Todo time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE COCKTAIL */
router.get("/", [authJwt.verifyToken], TodoCtrl.getAllTodos);
router.get("/:id", [authJwt.verifyToken], TodoCtrl.getTodoById);

router.put("", [authJwt.verifyToken], TodoCtrl.addTodo);
router.patch("/update", [authJwt.verifyToken], TodoCtrl.updateTodo);

router.post("/untrash", [authJwt.verifyToken], TodoCtrl.untrashTodo);
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", [authJwt.verifyToken], TodoCtrl.trashTodo);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", [authJwt.verifyToken], TodoCtrl.destroyTodo);
module.exports = router;
