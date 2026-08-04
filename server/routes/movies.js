const express = require("express");
const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/connection");
const defineMovie = require("../models/Movie");

const router = express.Router();
const Movie = defineMovie(sequelize, DataTypes);

router.get("/", (req, res) => {
  const { search, subgenre, decade, minRating } = req.query;

  const where = {};

  if (search) {
    where.title = {
      [Op.like]: `%${search}%`,
    };
  }

  if (decade) {
    const decadeStart = Number(decade);

    if (Number.isNaN(decadeStart)) {
      return res.status(400).json({
        message: "decade must be a valid year",
      });
    }

    where.releaseYear = {
      [Op.between]: [decadeStart, decadeStart + 9],
    };
  }

  if (minRating) {
    const rating = Number(minRating);

    if (Number.isNaN(rating)) {
      return res.status(400).json({
        message: "minRating must be a number",
      });
    }

    where.averageRating = {
      [Op.gte]: rating,
    };
  }

  Movie.findAll({
    where,
    order: [["title", "ASC"]],
  })
    .then((movies) => {
      let filteredMovies = movies.map((movie) => movie.toJSON());

      if (subgenre) {
        filteredMovies = filteredMovies.filter(
          (movie) =>
            Array.isArray(movie.categories) &&
            movie.categories.some(
              (category) =>
                category.toLowerCase() === subgenre.toLowerCase()
            )
        );
      }

      res.json({ movies: filteredMovies });
    })
    .catch((error) => {
      console.error("Movie fetch error:", error);
      res.status(500).json({
        message: "Error fetching movies",
        error: error.message,
      });
    });
});
router.get("/:id", (req, res) => {
  Movie.findOne({
    where: {
      tmdbId: req.params.id,
    },
  })
    .then((movie) => {
      if (!movie) {
        return res.status(404).json({
          message: "Movie not found",
        });
      }

      res.json(movie.toJSON());
    })
    .catch((error) => {
      console.error("Movie detail fetch error:", error);
      res.status(500).json({
        message: "Error fetching movie",
        error: error.message,
      });
 });
 });
module.exports = router;
