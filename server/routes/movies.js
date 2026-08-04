const express = require("express");
const router = express.Router();
const { Movie } = require("../models");

// GET /api/movies
// GET /api/movies?subgenre=Slasher
router.get("/", async (req, res) => {
  try {
    const { subgenre } = req.query;
    const where = {};

    if (subgenre && subgenre.toLowerCase() !== "all") {
      where.subgenre = subgenre;
    }

    const movies = await Movie.findAll({ where });
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Error fetching movies", error: error.message });
  }
});

// GET /api/movies/:id
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie", error: error.message });
  }
});

module.exports = router;