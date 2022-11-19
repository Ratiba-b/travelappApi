/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const User = DB.User;
const Travel = DB.Travel;
const Step = DB.Step;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE step */

exports.getAllSteps = (req, res) => {
  Step.findAll()
    .then((step) => res.json({ data: step }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

// recuperer une etape
exports.getStepById = async (req, res) => {
  let stepId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!stepId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le step

    let step = await Step.findOne({
      where: { id: stepId },
      include: {
        model: Planning,
        attributes: [
          "id",
          "description",
          "start",
          "end",
          "location",
          "hourStart",
          "hourEnd",
        ],
      },
    });

    //test si resultat
    if (step === null) {
      return res.status(404).json({ message: "This step does not exist" });
    }

    // renvoi du step trouvé
    return res.json({ data: step });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

// ajouter un nouveau step
exports.addStep = async (req, res) => {
  const data = {
    travel_id: req.body.travel_id,
    start: req.body.start,
    end: req.body.end,
    details: req.body.details,
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
    // verification si le step existe
    console.log("travelID", data.travel_id);
    // let step = await step.findOne({
    //   where: { travel_id: travel_id },
    //   // attributes: ["id"],
    // });
    // if (step !== null) {
    //   return res.status(409).json({ message: "The step already exists" });
    // }

    //creation du step
    // console.log("step", step);

    let step = await Step.create(data);
    return res.json({ message: "step created", data: step });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// update un step
exports.updateStep = async (req, res) => {
  let stepId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (stepId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let step = await Step.findOne({
      where: { id: stepId },
      raw: true,
    });
    // VERIFIER SI step EXISTE
    if (step === null) {
      return res.status(404).json({ message: "This step does not exist" });
    }

    // MISE A JOUR DU step
    await Step.update(req.body, { where: { id: travelId } });
    return res.json({ message: "Panning Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// trash un step
exports.trashStep = (req, res) => {
  let stepId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!stepId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Step.destroy({ where: { id: stepId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

// untrash step
exports.untrashStep = async (req, res) => {
  let stepId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT

  if (!stepId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Step.restore({ where: { id: stepId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

//detruire definitive un step
exports.destroyStep = (req, res) => {
  let stepId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!stepId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Step.destroy({ where: { id: stepId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
