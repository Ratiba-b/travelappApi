/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const Cocktail = DB.Cocktail;
const User = DB.User;
// const UserError = require("../error");

/***********************************************/
/** ROUTAGE DE LA RESSOURCE COCKTAIL */
exports.getAllCocktails = (req, res) => {
  Cocktail.findAll()
    .then((cocktails) => res.json({ data: cocktails }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.getCocktail = async (req, res) => {
  let cocktailId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!cocktailId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le cocktail
    let cocktail = await Cocktail.findOne({
      where: { id: cocktailId },
      include: { model: User, attributes: ["id", "username", "email"] },
    });

    //test si resultat
    if (cocktail === null) {
      return res.status(404).json({ message: "This cocktail does not exist" });
    }

    // renvoi du cocktail trouvé
    return res.json({ data: cocktail });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addCocktail = async (req, res) => {
  const { user_id, nom, description, recette } = req.body;

  // validation des donnes recues
  if (!user_id || !nom || !description || !recette) {
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le cocktail existe
    let cocktail = await Cocktail.findOne({ where: { nom: nom }, raw: true });
    if (cocktail !== null) {
      return res
        .status(409)
        .json({ message: `The cocktail ${nom} already exists` });
    }

    //creation du cocktail
    cocktail = await Cocktail.create(req.body);
    return res.json({ message: "Cocktail created", data: cocktail });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.updateCocktail = async (req, res) => {
  let cocktailId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!cocktailId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let cocktail = await Cocktail.findOne({
      where: { id: cocktailId },
      raw: true,
    });
    // VERIFIER SI COKCTAIL EXISTE
    if (cocktail === null) {
      return res.status(404).json({ message: "This cocktail does not exist" });
    }

    // MISE A JOUR DU COCKTAIL
    await Cocktail.update(req.body, { where: { id: cocktailId } });
    return res.json({ message: "Cocktail Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.untrashCocktail = (req, res) => {
  let cocktailId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!cocktailId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  Cocktail.restore({ where: { id: cocktailId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************* */
/** METTRE A LA POUBELLE*/
exports.trashCocktail = (req, res) => {
  let cocktailId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!cocktailId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Cocktail.destroy({ where: { id: cocktailId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
exports.deleteCocktail = (req, res) => {
  let cocktailId = parseInt(req.params.id);

  //VERIFICATIO? SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!cocktailId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Cocktail.destroy({ where: { id: cocktailId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
