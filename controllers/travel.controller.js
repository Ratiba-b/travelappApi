/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const User = DB.User;
const Travel = DB.Travel;
// const Planning = db.planning;

exports.addTravel = async (req, res) => {
  const { user_id, title, description, location, startDate, endDate } =
    req.body;

  // validation des donnes recues
  if (
    !user_id ||
    !title ||
    !description ||
    !location ||
    !startDate ||
    !endDate
  ) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le cocktail existe
    let travel = await Travel.findOne({ where: { title: title }, raw: true });

    if (travel !== null) {
      console.log(travel);
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
};

// get all travels
exports.getAllTravels = async (req, res) => {
  await Travel.findAll()
    .then((travels) => {
      res.json({ data: travels });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err });
    });
};
// get all users with travels
exports.findAll = () => {
  return User.findAll({
    include: ["travels"],
  }).then((users) => {
    return users;
  });
};

// get all travels for one user
exports.findUserById = (userId) => {
  return User.findByPk(userId, { include: ["travels"] })
    .then((user) => {
      return user;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorials: ", err);
    });
};

// get one travel based on it's id
exports.getTravelById = async (req, res) => {
  let travelId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!travelId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    // recuperer le cocktail
    let travel = await Travel.findOne({
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
    console.log("err message", err);
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

// update un travel
exports.updateTravel = async (req, res) => {
  let travelId = parseInt(req.params.id, 10);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!travelId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    // recherche d'un travel et vérification
    let travel = await Travel.findOne({
      where: { id: travelId },
      raw: true,
    });

    // VERIFIER SI TRAVEL EXISTE
    if (travel === null) {
      return res.status(404).json({ message: "This travel does not exist" });
    }
    // MISE A JOUR DU TRAVEL
    await Travel.update(req.body, { where: { id: travelId } });
    return res.json({ message: "Travel Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// mettre un travel a la poubelle
exports.trashTravel = async (req, res) => {
  let travelId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!travelId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  await Travel.destroy({ where: { id: travelId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

// untrash travel
exports.untrashTravel = async (req, res) => {
  let travelId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!travelId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Travel.restore({ where: { id: travelId } }).then(() => {
    res
      .status(204)
      .json({})
      .catch((err) =>
        res.status(500).json({ message: "Database error", error: err })
      );
  });
};

// supprimer defitivement un travel
exports.destroyTravel = async (req, res) => {
  let travelId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!travelId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  await Travel.destroy({ where: { id: travelId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
// exports.findTravelById = (id) => {
//   return Travel.findByPk(id, { include: ["user"] })
//     .then((travel) => {
//       return travel;
//     })
//     .catch((err) => {
//       console.log(">> Error while finding travel: ", err);
//     });
// };

// exports.createPlanning = (travelId, planning) => {
//   return Planning.create({
//     title: planning.title,
//     event: planning.event,
//     start: planning.start,
//     end: planning.end,
//   })
//     .then((planning) => {
//       console.log(">> Created planning: " + JSON.stringify(planning, null, 4));
//       return planning;
//     })
//     .catch((err) => {
//       console.log(">> Error while creating planning: " + err);
//     });
// };
