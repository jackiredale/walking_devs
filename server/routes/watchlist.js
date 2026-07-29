const router = require("express").Router();
const { Watchlist } = require("../models");
const { requireAuth } = require("../utils/auth");

router.get("/", requireAuth, async (req, res) => {
  try {
    const list = await Watchlist.findAll({
      where: { userId: req.user.id },
    });

    res.json(list);
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    res.status(500).json({ message: "Error fetching watchlist", error: error.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { tmdbId, title, posterPath } = req.body;

    if (!tmdbId || !title) {
      return res.status(400).json({ message: "tmdbId and title are required" });
    }

    const [entry, created] = await Watchlist.findOrCreate({
      where: { userId: req.user.id, tmdbId },
      defaults: { title, posterPath },
    });

    res.status(created ? 201 : 200).json(entry);
  } catch (error) {
    console.error("Watchlist add error:", error);
    res.status(500).json({ message: "Error adding to watchlist", error: error.message });
  }
});

router.post("/:movieId", requireAuth, async (req, res) => {
  try {
    const tmdbId = Number(req.body.tmdbId || req.params.movieId);
    const title = req.body.title || `Movie ${tmdbId}`;
    const posterPath = req.body.posterPath || null;

    const [entry, created] = await Watchlist.findOrCreate({
      where: { userId: req.user.id, tmdbId },
      defaults: { title, posterPath },
    });

    res.status(created ? 201 : 200).json(entry);
  } catch (error) {
    console.error("Watchlist add error:", error);
    res.status(500).json({ message: "Error adding to watchlist", error: error.message });
  }
});

router.delete("/:movieId", requireAuth, async (req, res) => {
  try {
    await Watchlist.destroy({
      where: { userId: req.user.id, tmdbId: req.params.movieId },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Watchlist delete error:", error);
    res.status(500).json({ message: "Error removing from watchlist", error: error.message });
  }
});

module.exports = router;
