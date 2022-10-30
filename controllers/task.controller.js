/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const Task = DB.Task;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE TODO */
exports.getAllTasks = (req, res) => {
  Task.findAll()
    .then((task) => res.json({ data: task }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.getTaskById = async (req, res) => {
  let taskId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!taskId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le planning

    let task = await Task.findOne({
      where: { id: taskId },
      include: {
        model: Todo,
        attributes: ["id"],
      },
    });

    //test si resultat
    if (task === null) {
      return res.status(404).json({ message: "This task does not exist" });
    }

    // renvoi du planning trouvé
    return res.json({ data: task });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addTask = async (req, res) => {
  const { todo_id, task } = req.body;
  // validation des donnes recues
  if (!todo_id || !task) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le planning existe

    // let task = await Task.findOne({
    //   where: { title: title },
    //   raw: true,
    // });
    // if (task !== null) {
    //   return res
    //     .status(409)
    //     .json({ message: `The todo ${title} already exists` });
    // }

    //creation du planning

    let task = await Task.create(req.body);
    return res.json({ message: "task created", data: task });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.updateTask = async (req, res) => {
  let taskId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (taskId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let task = await Task.findOne({
      where: { id: taskId },
      raw: true,
    });
    // VERIFIER SI PLANNING EXISTE
    if (task === null) {
      return res.status(404).json({ message: "This todo does not exist" });
    }

    // MISE A JOUR DU PLANNING
    await Task.update(req.body, { where: { id: taskId } });
    return res.json({ message: "task Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.untrashTask = async (req, res) => {
  let taskId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT

  if (!taskId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Task.restore({ where: { id: taskId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************* */
/** METTRE A LA POUBELLE*/
exports.trashTask = (req, res) => {
  let taskId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!taskId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Task.destroy({ where: { id: taskId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
exports.destroyTask = (req, res) => {
  let taskId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!taskId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Task.destroy({ where: { id: taskId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
