/****************************************/
/** IMPORT DES MODULES */
const express = require("express");
const cors = require("cors");
const checkTokenMiddleware = require("./jsonwebtoken/check");

/****************************************/
/** IMPORT DE LA CONNEXION A LA DB */
let DB = require("./config/db.config");

/****************************************/
/** INITIALISATION DE L'API */
const app = express();

app.use(cors()); // parse requests of content-type - application/json
app.use(express.json()); // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/********************************************/
/** IMPORT DES MODULES*/
const user_router = require("./routes/user.routes");
const cocktail_router = require("./routes/cocktail.routes");
const travel_router = require("./routes/travel.routes");

const auth_router = require("./routes/auth.routes");

/*****************************************/
/** MISE EN PLACE DU ROUTAGE */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to travelapp application." });
});

app.use("/users", checkTokenMiddleware, user_router);
app.use("/cocktails", cocktail_router);
// app.use("/travels", travel_router);

app.use("/auth", auth_router);

app.get("*", (req, res) => {
  res.status(501).send("server.js send : Tu cherches quoi ?");
});

/*****************************************/
/** START SERVEUR AVEC TEST DB*/

DB.authenticate()
  .then(() => console.log("Database connection is ok"))

  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}.`);
    });
  })
  .catch((err) => console.log("Database error: " + err));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

// let corsOptions = {
//   origin: "http://localhost:8081",
// };

// DATABASE

// const db = require("./models");
// db.sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("  Drop and re-Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

// set port, listen for requests

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();

// // let corsOptions = {
// //   origin: "http://localhost:8081/",
// // };

// // app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

// // // parse requests of content-type - application/json
// // app.use(bodyParser.json());

// // // parse requests of content-type - application/x-www-form-urlencoded
// // app.use(bodyParser.urlencoded({ extended: true }));

// // parse requests of content-type - application/json
// app.use(express.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// // BASE DE DONNEES
// const db = require("./models");
// const Role = db.role;

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });

//   Role.create({
//     id: 2,
//     name: "moderator",
//   });

//   Role.create({
//     id: 3,
//     name: "admin",
//   });
// }

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });
// // routes
// require("./routes/auth.routes")(app);
// require("./routes/user.routes")(app);
// require("./routes/tutorial.routes")(app);

// // set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
