const express = require("express");
const router = express.Router();
const { Watchlist } = require("../models");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// GET /api/watchlist
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const items = await Watchlist.findAll({ where: { userId: req.user.id } });
    res.json(items);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Error fetching watchlist", error: error.message });
  }
});

// POST /api/watchlist/:tmdbId
router.post("/:tmdbId", authenticateJWT, async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { title, posterPath } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const [entry, created] = await Watchlist.findOrCreate({
      where: { userId: req.user.id, tmdbId },
      defaults: { title, posterPath },
    });

    res.status(created ? 201 : 200).json(entry);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ message: "Error adding to watchlist", error: error.message });
  }
});

// DELETE /api/watchlist/:tmdbId
router.delete("/:tmdbId", authenticateJWT, async (req, res) => {
  try {
    const { tmdbId } = req.params;
    await Watchlist.destroy({ where: { userId: req.user.id, tmdbId } });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Error removing from watchlist", error: error.message });
  }
});

module.exports = router;