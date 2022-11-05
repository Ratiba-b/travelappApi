const db = require("../config/db.config");
const User = db.User;
const Role = db.Role;

const { Op } = require("sequelize");

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log("Check signup", req.body);

  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  console.log("signin", req);
  const { username, password } = req.body;

  // validation des donnees recues
  if (!username || !password) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        console.log("user signin", user);
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      // GENERATION DU TOKEN
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_DURING,
      });

      let authorities = [];
      user.getRoles().then((roles) => {
        console.log("user.getRoles()", user.getRoles());
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,

          roles: authorities,
          access_token: token,
        });
        console.log("Check user", authorities);
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
