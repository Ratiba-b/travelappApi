/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");

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
router.get("", (req, res) => {
  User.findAll()
    .then((users) => res.json({ data: users }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

router.get("/:id", (req, res) => {
  let userId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!userId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  //Recuperer le user id
  User.findOne({ where: { id: userId }, raw: true })
    .then((user) => {
      if (user === null) {
        return res.status(404).json({ message: "This user does not exist" });
      }

      // User trouvé
      return res.json({ data: user });
    })
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

router.put("", (req, res) => {
  const { username, email, password } = req.body;

  // validation des donnes recues
  if (!username || !email || !password) {
    return res.status(400).json({ message: "missing datas" });
  }

  User.findOne({ where: { email: email }, raw: true })
    .then((user) => {
      // verification si l'utilisateur existe deja
      if (user !== null) {
        return res
          .status(409)
          .json({ message: `The user ${username} already exists` });
      }

      // HASHING PASSWORD
      bcrypt
        .hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        .then((hash) => {
          req.body.password = hash;

          //CREATION DE L'UTILISATEUR
          User.create(req.body)
            .then((user) => res.json({ message: "User created", data: user }))
            .catch((err) =>
              res.status(500).json({ message: "Database error", error: err })
            );
        })
        .catch((err) =>
          res.status(500).json({ message: "hash process error", error: err })
        );
    })
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

router.patch("/:id", (req, res) => {
  let userId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!userId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  //RECHERCHE DE L'UTILISATEUR
  User.findOne({ where: { id: userId }, raw: true }).then((user) => {
    // VERIFIER SI USER EXISTE
    if (user === null) {
      return res.status(404).json({ message: "This user does not exist" });
    }

    // MISE A JOUR DE L'UTILISATEUR
    User.update(req.body, { where: { id: userId } })
      .then((user) => res.json({ message: "User Updated" }))
      .catch((err) =>
        res.status(500).json({ message: "Database error", error: err })
      );
  });
});

router.post("/untrash/:id", (req, res) => {
  let userId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!userId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  User.restore({ where: { id: userId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", (req, res) => {
  let userId = parseInt(req.params.id);

  //VERIFICATIO? SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!userId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  User.destroy({ where: { id: userId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", (req, res) => {
  let userId = parseInt(req.params.id);

  //VERIFICATIO? SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!userId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  User.destroy({ where: { id: userId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

module.exports = router;
