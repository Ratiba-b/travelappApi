/**********************************************/
/** IMPORT DES MODULES */
const bcrypt = require("bcrypt");

const DB = require("../config/db.config");
const User = DB.User;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE USER */
exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => res.json({ data: users }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.getUser = async (req, res) => {
  let userId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!userId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer et verifier le user
    let user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "email"],
    });
    if (user === null) {
      return res.status(404).json({ message: "This user does not exist" });
    }
    // User trouvé
    return res.json({ data: user });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addUser = async (req, res) => {
  const { username, email, password } = req.body;

  // validation des donnes recues
  if (!username || !email || !password) {
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si l'utilisateur existe deja
    let user = await User.findOne({ where: { email: email }, raw: true });
    if (user !== null) {
      return res
        .status(409)
        .json({ message: `The user ${username} already exists` });
    }
    // Hashage du mot de passe utilisateur
    // let hash = await bcrypt.hash(
    //   password,
    //   parseInt(process.env.BCRYPT_SALT_ROUND)
    // );
    // req.body.password = hash;

    //CREATION DE L'UTILISATEUR
    let newUser = await User.create(req.body);
    return res.json({ message: "User created", data: newUser });
  } catch (err) {
    if (err.name === "SequelizeDatabaseError") {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res
      .status(500)
      .json({ message: "login process failed", error: err });
  }
};

exports.updateUser = async (req, res) => {
  let userId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!userId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    let user = await User.findOne({ where: { id: userId }, raw: true });
    if (user === null) {
      return res.status(404).json({ message: "This user does not exist" });
    }

    // MISE A JOUR DE L'UTILISATEUR
    await User.update(req.body, { where: { id: userId } });
    return res.json({ message: "User Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.untrashUser = (req, res) => {
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
};

/************************* */
/** METTRE A LA POUBELLE*/
exports.trashUser = (req, res) => {
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
};

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
exports.deleteUser = (req, res) => {
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
};
