/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const Todo = DB.Todo;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE TODO */
exports.getAllTodos = (req, res) => {
  Todo.findAll()
    .then((todo) => res.json({ data: todo }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.getTodoById = async (req, res) => {
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
        model: Task,
        attributes: ["id", "task"],
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
    console.log("err message", err);
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addTodo = async (req, res) => {
  const { travel_id, task } = req.body;
  // validation des donnes recues
  if (!travel_id || !task) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le planning existe

    // let todo = await Todo.findOne({
    //   where: { travel_id: travel_id },
    //   raw: true,
    // });
    // if (todo !== null) {
    //   return res.status(409).json({ message: `The todo already exists` });
    // }

    //creation du planning

    let todo = await Todo.create(req.body);
    return res.json({ message: "Todo created", data: todo });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.updateTodo = async (req, res) => {
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
};

exports.untrashTodo = async (req, res) => {
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
};

/************************* */
/** METTRE A LA POUBELLE*/
exports.trashTodo = (req, res) => {
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
};

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
exports.destroyTodo = (req, res) => {
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
};
