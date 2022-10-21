/**********************************************/
/** IMPORT DES MODULES */
const express = require("express");
const DB = require("../config/db.config");
const Todo = DB.Todo;
const Travel = DB.Travel;

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
router.get("/", (req, res) => {
  Todo.findAll()
    .then((todo) => res.json({ data: todo }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});
router.get("/:id", async (req, res) => {
  let todoId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!todoId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le planning

    let todo = await Todo.findOne({
      where: { id: todoId },
      include: {
        model: Travel,
        attributes: [
          "id",
          "title",
          "description",
          "location",
          "startDate",
          "endDate",
        ],
      },
    });

    //test si resultat
    if (todo === null) {
      return res.status(404).json({ message: "This todo does not exist" });
    }

    // renvoi du planning trouvé
    return res.json({ data: todo });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
});

router.put("/add", async (req, res) => {
  const { travel_id, title, task } = req.body;
  // validation des donnes recues
  if (!travel_id || !task || !task) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le planning existe

    let todo = await Todo.findOne({
      where: { title: title },
      raw: true,
    });
    if (todo !== null) {
      return res
        .status(409)
        .json({ message: `The todo ${title} already exists` });
    }

    //creation du planning

    todo = await Todo.create(req.body);
    return res.json({ message: "Todo created", data: todo });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
});
router.patch("/update", async (req, res) => {
  let todoId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (todoId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let todo = await Todo.findOne({
      where: { id: todoId },
      raw: true,
    });
    // VERIFIER SI PLANNING EXISTE
    if (todo === null) {
      return res.status(404).json({ message: "This todo does not exist" });
    }

    // MISE A JOUR DU PLANNING
    await Todo.update(req.body, { where: { id: todoId } });
    return res.json({ message: "Todo Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
});

router.post("/untrash", async (req, res) => {
  let todoId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT

  if (!todoId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Todo.restore({ where: { id: todoId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});
/************************* */
/** METTRE A LA POUBELLE*/
router.delete("/trash/:id", (req, res) => {
  let todoId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!todoId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Todo.destroy({ where: { id: todoId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
router.delete("/:id", (req, res) => {
  let todoId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!todoId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Todo.destroy({ where: { id: todoId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
});
module.exports = router;
