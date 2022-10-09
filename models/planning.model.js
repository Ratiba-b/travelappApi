module.exports = (sequelize, Sequelize) => {
  const Planning = sequelize.define("planning", {
    title: {
      type: Sequelize.STRING,
    },

    event: {
      type: Sequelize.STRING,
    },
    start: {
      type: Sequelize.DATE,
    },
    end: {
      type: Sequelize.DATE,
    },
  });
  return Planning;
};
