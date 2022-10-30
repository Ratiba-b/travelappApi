/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const articleCtrl = require("../controllers/article.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, picture, cb) => {
    return cb(
      null,
      `${picture.fieldname}_${Date.now()}${path.extname(picture.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

let router = express.Router();

/***********************************************/
/** MIDDLEWARE POUR LOGGER DATES DE REQUETES */
router.use((req, res, next) => {
  const event = new Date();
  console.log("article time: ", event.toString());
  next();
});

/***********************************************/
/** ROUTAGE DE LA RESSOURCE COCKTAIL */
router.get("/", articleCtrl.getAllArticles);
router.get("/:id", articleCtrl.getArticleById);

router.put("", upload.single("picture"), articleCtrl.addArticle);
router.patch("/:id", upload.single("picture"), articleCtrl.updateArticle);

router.post("/untrash", articleCtrl.untrashArticle);
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", articleCtrl.trashArticle);

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", articleCtrl.destroyArticle);
module.exports = router;
