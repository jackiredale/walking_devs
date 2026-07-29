// POST /api/watchlist/:movieId
router.post("/watchlist/:movieId", requireAuth, async (req, res) => {
  await Watchlist.findOrCreate({
    where: { userId: req.user.id, movieId: req.params.movieId },
  });
  res.sendStatus(201);
});

// DELETE /api/watchlist/:movieId
router.delete("/watchlist/:movieId", requireAuth, async (req, res) => {
  await Watchlist.destroy({
    where: { userId: req.user.id, movieId: req.params.movieId },
  });
  res.sendStatus(204);
});

// GET /api/watchlist
router.get("/watchlist", requireAuth, async (req, res) => {
  const list = await Watchlist.findAll({
    where: { userId: req.user.id },
    include: [Movie],
  });
  res.json(list);
});