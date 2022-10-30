/****************** ENVOIE DE FICHIER VIA HTTP */
const multer = require("multer");

// dico des mime types
const MIME_TYPES = {
  "image/png": "jpg",
  "image/jpeg": "jpeg",
  "image/gif": "gif",
  "image/svg": "png",
};

// destination du fichier et générer un nom du fichier unique
const storage = multer.diskStorage({
  // destination stockage du fichier
  destination: (req, picture, cb) => {
    callback(null, "uploads");
  },
  filename: (req, picture, cb) => {
    // supprimer les espaces
    const name = picture.originalname.split(" ").join("_");
    const extension = MIME_TYPES[picture.mimetype];

    cb(null, name + "_" + Date.now() + extension);
  },
});

module.exports = multer({ storage }).single("picture");
