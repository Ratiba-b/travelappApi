/**********************************************/
/** IMPORT DES MODULES */
const jwt = require("jsonwebtoken");

/**********************************************/
/** EXTRACTION DU TOKEN */
const extractBearer = (authorization) => {
  if (typeof authorization !== "string") {
    return false;
  }

  // on isole le token
  const matches = authorization.match(/(bearer)\s+(\S+)/i); // expression regulieres

  return matches && matches[2];
};

/**********************************************/
/** VERIFICATION DE LA PRESENCE DU TOKEN */

const checkTokenMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization && extractBearer(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Pas de token" });
  }

  // Verifier la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  });
};

module.exports = checkTokenMiddleware;

// 1 on verifie si il y a bien l'attribu authoriwation dans le header
// 2 on essaie d'extraire le token - err 401 si il n'y a rien
// 3 on verifie la validité du token
