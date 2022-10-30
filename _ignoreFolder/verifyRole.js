const db = require("../config/db.config");
const ROLES = db.ROLES;

checkRolesExisted = (req, res, next) => {
  console.log("role", req.body);

  next();
};

module.exports = checkRolesExisted;
