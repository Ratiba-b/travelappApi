/**********************************************/
/** IMPORT DES MODULES */
const DB = require("../config/db.config");
const Article = DB.Article;

/***********************************************/
/** ROUTAGE DE LA RESSOURCE TODO */
exports.getAllArticles = (req, res) => {
  Article.findAll()
    .then((article) => res.json({ data: article }))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.getArticleById = async (req, res) => {
  let articleId = parseInt(req.params.id);

  // verifier si le champ id est present et coherent
  if (!articleId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //Recuperer le planning

    let article = await Article.findOne({
      where: { id: articleId },
      // include: {
      //   model: Planning,
      //   attributes: ["id"],
      // },
    });

    //test si resultat
    if (article === null) {
      return res.status(404).json({ message: "This article does not exist" });
    }

    // renvoi du planning trouvé
    return res.json({ data: article });
  } catch (err) {
    console.log("dans le catch");
    console.log("err message");
    console.log("err status");

    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addArticle = async (req, res) => {
  console.log("req", req.file.filename);
  const data = {
    user_id: req.body.user_id,
    title: req.body.title,
    location: req.body.location,
    description: req.body.description,
    picture: req.file.filename,
  };

  // validation des donnes recues
  if (!data) {
    console.log(req.body);
    return res.status(400).json({ message: "missing datas" });
  }

  try {
    // verification si le planning existe

    let article = await Article.findOne({
      where: { title: data.title },
      raw: true,
    });
    if (article !== null) {
      return res
        .status(409)
        .json({ message: `The todo ${data.title} already exists` });
    }

    //creation du planning

    article = await Article.create(data);
    return res.json({ message: "Article created", data: article });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.updateArticle = async (req, res) => {
  console.log("req", req.params.id);
  console.log("req", req.file);
  let articleId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT
  if (!articleId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  try {
    //RECHERCHE D"UN COCKTAIL et verification
    let article = await Article.findOne({
      where: { id: articleId },
      raw: true,
    });
    // VERIFIER SI PLANNING EXISTE
    if (article === null) {
      return res.status(404).json({ message: "This todo does not exist" });
    }

    // MISE A JOUR DU PLANNING
    const data = {
      user_id: req.body.user_id,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      picture: req.file.filename,
    };
    await Article.update(data, { where: { id: articleId } });
    return res.json({ message: "article Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.untrashArticle = async (req, res) => {
  let articleId = parseInt(req.params.id);

  // VERIFICATION SI LE CHAMP ID ET COHERENT

  if (!articleId) {
    return res.status(400).json({ message: "Missing parameter" });
  }
  await Article.restore({ where: { id: articleId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************* */
/** METTRE A LA POUBELLE*/
exports.trashArticle = (req, res) => {
  let articleId = parseInt(req.params.id);

  //VERIFICATIOn SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!articleId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Article.destroy({ where: { id: articleId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

/************************************************* */
/**SUPPRIMER DEFINITIVEMENT DE LA BASE DE DONNEES */
exports.destroyArticle = (req, res) => {
  let articleId = parseInt(req.params.id);

  //VERIFICATION SI LE CHAMP ID EST PRESENT ET COHERENT
  if (!articleId) {
    res.status(400).json({ message: "Missing parameter" });
  }

  //SUPRESSION DE L'UTILISATEUR
  Article.destroy({ where: { id: articleId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
