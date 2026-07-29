const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

const User = require("./User")(sequelize, DataTypes);
const Movie = require("./Movie")(sequelize, DataTypes);
const Watchlist = require("./Watchlist")(sequelize, DataTypes);
const Rating = require("./Rating")(sequelize, DataTypes);

const models = { User, Movie, Watchlist, Rating };

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
