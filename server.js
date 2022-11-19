/****************************************/
/** IMPORT DES MODULES */
const express = require("express");
const cors = require("cors");
// const checkTokenMiddleware = require("./jsonwebtoken/check");
const { authJwt } = require("./Middlewares/verifySignUp");
const path = require("path");

// const multer = require("multer");

// const fileFilter = function (req, picture, cb) {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

//   if (!allowedTypes.includes(picture.mimetype)) {
//     const error = new Error("wrong file type");
//     error.code = "LIMIT_FILE_TYPES";
//     return cb(error, false);
//   }
//   cb(null, true);
// };
// const MAX_SIZE = 200000;
// const upload = multer({
//   dest: "./uploads/",
//   fileFilter,
//   limits: {
//     fileSize: MAX_SIZE,
//   },
// });
/****************************************/
/** IMPORT DE LA CONNEXION A LA DB */
let DB = require("./config/db.config");

/****************************************/
/** INITIALISATION DE L'API */
const app = express();

var dir = path.join(__dirname, "uploads");

app.use(express.static(dir));
app.use(
  cors({
    origin: " *",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders:
      "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization ",
  })
); // parse requests of content-type - application/json
app.use(express.json()); // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/********************************************/
/** IMPORT DES MODULES*/
const user_router = require("./routes/user.routes");
const cocktail_router = require("./routes/cocktail.routes");
const travel_router = require("./routes/travel.routes");
const planning_router = require("./routes/planning.routes");
const todo_router = require("./routes/todo.routes");
const event_router = require("./routes/event.routes");
const task_router = require("./routes/task.routes");
const article_router = require("./routes/article.routes");
const step_router = require("./routes/step.routes");

const auth_router = require("./routes/auth.routes");

/*****************************************/
/** MISE EN PLACE DU ROUTAGE */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to travelapp application." });
});

app.use("/users", user_router);
app.use("/cocktails", cocktail_router);
app.use("/travels", travel_router);
app.use("/plannings", planning_router);
app.use("/events", event_router);
app.use("/todos", todo_router);
app.use("/todos/task", task_router);
app.use("/articles", article_router);
app.use("/steps", article_router);

// app.use("/auth", auth_router);

// route picture article
// app.put("/article/upload", upload.single("picture"), (req, res) => {
//   res.json({ picture: req.picture });
// });

// app.use(function (err, req, res, next) {
//   if (err.code === "LIMIT_FILE_TYPES") {
//     res.status(422).json({ error: "Only image are allowed" });
//     return;
//   }

//   if (err.code === "LIMIT_FILE_SIZE") {
//     res
//       .status(422)
//       .json({ error: `Size is too large max is ${MAX_SIZE / 1000}kb` });
//     return;
//   }
// });

// TEST ROUTES ROLES
// routes
require("./routes/auth.routes")(app);
// require("./testRoutes/user.routes")(app);
app.get("*", (req, res) => {
  res.status(501).send("server.js send : Tu cherches quoi ?");
});

app.use((error, req, res, next) => {
  console.log("je suis dans le middleware");
  console.log(error);
  return res
    .status(error.statusCode || 500)
    .json({ message: error.message, error: error });
});
/*****************************************/
/** START SERVEUR AVEC TEST DB*/

DB.sequelize
  .authenticate()
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
