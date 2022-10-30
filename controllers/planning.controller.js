/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const User = DB.User;
const Travel = DB.Travel;
const Planning = DB.Planning;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE PLANNING */

exports.getAllPlannings = (req, res) => {
  Planning.findAll()
    .then((planning) => res.json({ data: planning }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

// recuperer un voyage
exports.getPlanningById = async (req, res) => {
  let planningId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!planningId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le planning

    let planning = await Planning.findOne({
      where: { id: planningId },
      include: {
        model: Event,
        attributes: ["id", "description", "start", "end"],
      },
    });

    //test si resultat
    if (planning === null) {
      return res.status(404).json({ message: "This planning does not exist" });
    }

    // renvoi du planning trouvé
    return res.json({ data: planning });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

// ajouter un nouveau planning
exports.addPlanning = async (req, res) => {
  const data = {
    travel_id: req.body.travel_id,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
    location: req.body.location,
  };
  // validation des donnes recues
  if (!data) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }
  console.log(req.body.travel_id);
  console.log("body", data.travel_id);

  try {
    // verification si le planning existe
    console.log("travelID", data.travel_id);
    // let planning = await Planning.findOne({
    //   where: { travel_id: travel_id },
    //   // attributes: ["id"],
    // });
    // if (planning !== null) {
    //   return res.status(409).json({ message: "The planning already exists" });
    // }

    //creation du planning
    // console.log("planning", planning);

    let planning = await Planning.create(data);
    return res.json({ message: "Planning created", data: planning });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// update un planning
exports.updatePlanning = async (req, res) => {
  let planningId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (planningId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let planning = await Planning.findOne({
      where: { id: planningId },
      raw: true,
    });
    // VERIFIER SI PLANNING EXISTE
    if (planning === null) {
      return res.status(404).json({ message: "This planning does not exist" });
    }

    // MISE A JOUR DU PLANNING
    await Planning.update(req.body, { where: { id: travelId } });
    return res.json({ message: "Panning Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// trash un planning
exports.trashPlanning = (req, res) => {
  let planningId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!planningId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Planning.destroy({ where: { id: planningId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

// untrash planning
exports.untrashPlanning = async (req, res) => {
  let planningId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT

  if (!planningId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Planning.restore({ where: { id: planningId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

//detruire definitive un planning
exports.destroyPlanning = (req, res) => {
  let planningId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!planningId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Planning.destroy({ where: { id: planningId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
