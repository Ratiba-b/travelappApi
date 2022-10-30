/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const TodoCtrl = require("../controllers/todo.controller");

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
router.get("/", TodoCtrl.getAllTodos);
router.get("/:id", TodoCtrl.getTodoById);

router.put("", TodoCtrl.addTodo);
router.patch("/update", TodoCtrl.updateTodo);

router.post("/untrash", TodoCtrl.untrashTodo);
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", TodoCtrl.trashTodo);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", TodoCtrl.destroyTodo);
module.exports = router;
