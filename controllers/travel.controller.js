const db = require("../models");
const Travel = db.travel;
const Planning = db.planning;
const User = db.user;

exports.createTravel = (userId, travel) => {
  return Travel.create({
    title: travel.title,
    description: travel.description,
    location: travel.location,
    startDate: travel.startDate,
    endDate: travel.endDate,
    userId: userId,
  })
    .then((travel) => {
      console.log(">> Created travel: " + JSON.stringify(travel, null, 4));
      return travel;
    })
    .catch((err) => {
      console.log(">> Error while creating travel: ", err);
    });
};

// get all travels
exports.findAllTravels = (req, res) => {};

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
exports.findTravelById = (id) => {
  return Travel.findByPk(id, { include: ["user"] })
    .then((travel) => {
      return travel;
    })
    .catch((err) => {
      console.log(">> Error while finding travel: ", err);
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
