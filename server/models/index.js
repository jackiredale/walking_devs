const sequelize = require("../config/connection");
const { DataTypes } = require("sequelize");

const User = require("./User")(sequelize, DataTypes);
const Movie = require("./Movie")(sequelize, DataTypes);
const Rating = require("./Rating")(sequelize, DataTypes);
const Watchlist = require("./Watchlist")(sequelize, DataTypes);

const models = { User, Movie, Rating, Watchlist };

// Run associations after all models are defined
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};