/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const Event = DB.Event;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE TODO */
exports.getAllEvents = (req, res) => {
  Event.findAll()
    .then((event) => res.json({ data: event }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.getEventById = async (req, res) => {
  let eventId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!eventId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le planning

    let event = await Event.findOne({
      where: { id: eventId },
      include: {
        model: Planning,
        attributes: ["id"],
      },
    });

    //test si resultat
    if (event === null) {
      return res.status(404).json({ message: "This event does not exist" });
    }

    // renvoi du planning trouvé
    return res.json({ data: event });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addEvent = async (req, res) => {
  const { planning_id, description, start, end } = req.body;
  // validation des donnes recues
  if (!planning_id || !description || !start || !end) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le planning existe

    // let event = await Event.findOne({
    //   where: { title: title },
    //   raw: true,
    // });
    // if (event !== null) {
    //   return res
    //     .status(409)
    //     .json({ message: `The todo ${title} already exists` });
    // }

    //creation du planning

    let event = await Event.create(req.body);
    return res.json({ message: "Event created", data: event });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.updateEvent = async (req, res) => {
  let eventId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (eventId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let event = await Event.findOne({
      where: { id: eventId },
      raw: true,
    });
    // VERIFIER SI PLANNING EXISTE
    if (event === null) {
      return res.status(404).json({ message: "This todo does not exist" });
    }

    // MISE A JOUR DU PLANNING
    await Event.update(req.body, { where: { id: eventId } });
    return res.json({ message: "event Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.untrashEvent = async (req, res) => {
  let eventId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT

  if (!eventId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Event.restore({ where: { id: eventId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************* */
/** METTRE A LA POUBELLE*/
exports.trashEvent = (req, res) => {
  let eventId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!eventId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Event.destroy({ where: { id: eventId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
exports.destroyEvent = (req, res) => {
  let eventId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!eventId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Event.destroy({ where: { id: eventId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
