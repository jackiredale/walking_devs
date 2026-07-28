// POST /api/movies/:movieId/rate
router.post("/movies/:movieId/rate", requireAuth, async (req, res) => {
  const { score } = req.body;
  const [rating] = await Rating.upsert({
    userId: req.user.id,
    movieId: req.params.movieId,
    score,
  }, { returning: true });
  res.json(rating);
});

// GET /api/movies/:movieId/ratings
router.get("/movies/:movieId/ratings", async (req, res) => {
  const avg = await Rating.findOne({
    where: { movieId: req.params.movieId },
    attributes: [[sequelize.fn("AVG", sequelize.col("score")), "average"]],
  });
  res.json(avg);
});