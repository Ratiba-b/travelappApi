/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const bcrypt = require("bcrypt");
const checkTokenMiddleware = require("../jsonwebtoken/check");

const Cocktail = require("../models/cocktail.model");
const User = require("../models/user.model");

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
/** ROUTAGE DE LA RESSOURCE USER */
router.get("", (req, res) => {
  Cocktail.findAll()
    .then((cocktails) => res.json({ data: cocktails }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

router.get("/:id", (req, res) => {
  let cocktailId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!cocktailId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  //Recuperer le user id
  Cocktail.findOne({
    where: { id: cocktailId },
    include: { model: User, attributes: ["id", "username", "email"] },
  })
    .then((cocktail) => {
      if (cocktail === null) {
        return res
          .status(404)
          .json({ message: "This cocktail does not exist" });
      }

      // User trouvé
      return res.json({ data: cocktail });
    })
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

router.put("", checkTokenMiddleware, (req, res) => {
  const { user_id, nom, description, recette } = req.body;

  // validation des donnes recues
  if (!user_id || !nom || !description || !recette) {
    return res.status(400).json({ message: "missing datas" });
  }

  Cocktail.findOne({ where: { nom: nom }, raw: true }).then((cocktail) => {
    // verification si le cocktail existe deja
    if (cocktail !== null) {
      return res
        .status(409)
        .json({ message: `The user ${nom} already exists` });
    }

    //creation du cocktail
    Cocktail.create(req.body)
      .then((cocktail) =>
        res.json({ message: "Cocktail created", data: cocktail })
      )
      .catch((err) =>
        res.status(500).json({ message: "Database error", error: err })
      );
  });
});

router.patch("/:id", checkTokenMiddleware, (req, res) => {
  let cocktailId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!cocktailId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  //RECHERCHE DE L'UTILISATEUR
  Cocktail.findOne({ where: { id: cocktailId }, raw: true }).then(
    (cocktail) => {
      // VERIFIER SI USER EXISTE
      if (cocktail === null) {
        return res
          .status(404)
          .json({ message: "This cocktail does not exist" });
      }

      // MISE A JOUR DE L'UTILISATEUR
      Cocktail.update(req.body, { where: { id: cocktailId } })
        .then((cocktail) => res.json({ message: "Cocktail Updated" }))
        .catch((err) =>
          res.status(500).json({ message: "Database error", error: err })
        );
    }
  );
});

router.post("/untrash/:id", checkTokenMiddleware, (req, res) => {
  let cocktailId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!cocktailId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  Cocktail.restore({ where: { id: cocktailId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", checkTokenMiddleware, (req, res) => {
  let cocktailId = parseInt(req.params.id);

  //VERIFICATIO? SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!cocktailId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Cocktail.destroy({ where: { id: cocktailId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", checkTokenMiddleware, (req, res) => {
  let cocktailId = parseInt(req.params.id);

  //VERIFICATIO? SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!cocktailId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Cocktail.destroy({ where: { id: cocktailId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

module.exports = router;
