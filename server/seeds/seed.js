const sequelize = require("../config/connection");
const { DataTypes } = require("sequelize");
const defineMovie = require("../models/Movie");
const movieData = require("./movieData.json");

const Movie = defineMovie(sequelize, DataTypes);

sequelize
  .sync()
  .then(() => Movie.destroy({ where: {} }))
  .then(() => Movie.bulkCreate(movieData))
  .then(() => {
    console.log(`Seeded ${movieData.length} movies.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Movie seed failed:", error);
    process.exit(1);
  });
