/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const taskCtrl = require("../controllers/task.controller");

let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("Task time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE COCKTAIL */
router.get("/", taskCtrl.getAllTasks);
router.get("/:id", taskCtrl.getTaskById);

router.put("", taskCtrl.addTask);
router.patch("/update", taskCtrl.updateTask);

router.post("/untrash", taskCtrl.untrashTask);
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", taskCtrl.trashTask);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", taskCtrl.destroyTask);
module.exports = router;
