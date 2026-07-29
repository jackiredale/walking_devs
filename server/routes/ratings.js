const router = require("express").Router();
const { sequelize, Movie, Rating } = require("../models");
const { requireAuth } = require("../utils/auth");

const findOrCreateMovie = async (movieId) => {
  const tmdbId = Number(movieId);
  const [movie] = await Movie.findOrCreate({
    where: { tmdbId },
    defaults: {
      title: `Movie ${tmdbId}`,
      posterPath: null,
    },
  });

  return movie;
};

router.post("/movies/:movieId/rate", requireAuth, async (req, res) => {
  try {
    const { score } = req.body;

    if (!score) {
      return res.status(400).json({ message: "Score is required" });
    }

    const movie = await findOrCreateMovie(req.params.movieId);
    const [rating] = await Rating.upsert(
      {
        userId: req.user.id,
        movieId: movie.id,
        score,
      },
      { returning: true }
    );

    res.json(rating);
  } catch (error) {
    console.error("Rating save error:", error);
    res.status(500).json({ message: "Error saving rating", error: error.message });
  }
});

router.get("/movies/:movieId/ratings", async (req, res) => {
  try {
    const movie = await Movie.findOne({ where: { tmdbId: Number(req.params.movieId) } });

    if (!movie) {
      return res.json({ average: null });
    }

    const avg = await Rating.findOne({
      where: { movieId: movie.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("score")), "average"]],
      raw: true,
    });

    res.json(avg);
  } catch (error) {
    console.error("Rating fetch error:", error);
    res.status(500).json({ message: "Error fetching rating", error: error.message });
  }
});

module.exports = router;
