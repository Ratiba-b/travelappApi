/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const checkTokenMiddleware = require("../jsonwebtoken/check");
const cocktailsCtrl = require("../controllers/cocktails.controller");
const { Travel } = require("../config/db.config");

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
/** ROUTAGE DE LA RESSOURCE TRAVELS */
router.get("/", (req, res) => {
  Travel.findAll()
    .then((travels) => {
      res.json({ data: travels });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err });
    });
});

router.get("/:id", (req, res) => {
  let travelId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!travelId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    // recuperer le cocktail
    let travel = Travel.findOne({
      where: { id: travelId },
      include: { model: User, attributes: ["id", "username", "email"] },
    });
    if (travel == null) {
      return res.status(404).json({ message: "This travel does not exist" });
    }
    // renvoi du travel trouvé
    return res.json({ data: travel });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
});

router.put("/add", (req, res) => {
  const { user_id, title, description, location, statDate, endDate } = req.body;

  // validation des donnes recues
  if (
    !user_id ||
    !title ||
    !description ||
    !location ||
    !statDate ||
    !endDate
  ) {
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le cocktail existe
    let travel = Travel.findOne({ where: { title: title }, raw: true });

    if (travel !== null) {
      return res
        .status(409)
        .json({ message: `The travel ${title} already exists` });
    }
    //creation du cocktail
    travel = Travel.create(req.body);
    return res.json({ message: "Travel created", data: travel });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
});

router.patch("/update", (req, res) => {
  let travelId = parseInt(req.params.id, 10);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!travelId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    // recherche d'un travel et vérification
    let travel = Travel.findOne({
      where: { id: travelId },
      raw: true,
    });

    // VERIFIER SI TRAVEL EXISTE
    if (travel === null) {
      return res.status(404).json({ message: "This travel does not exist" });
    }
    // MISE A JOUR DU TRAVEL
    Travel.update(req.body, { where: { id: travelId } });
    return res.json({ message: "Cocktail Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
});

router.post("/untrash", (req, res) => {
  let travelId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!travelId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  Travel.restore({ where: { id: travelId } }).then(() => {
    res
      .status(204)
      .json({})
      .catch((err) =>
        res.status(500).json({ message: "Database error", error: err })
      );
  });
});

/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", (req, res) => {
  let travelId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!travelId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Travel.destroy({ where: { id: travelId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/delete/:id", (req, res) => {
  let travelId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!travelId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Travel.destroy({ where: { id: travelId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});
module.exports = router;
