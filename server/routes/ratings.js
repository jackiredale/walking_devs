const express = require("express");
const router = express.Router();
const { Rating } = require("../models");

// Middleware for authenticating JWT tokens
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

// POST /api/ratings/:movieId
router.post("/:movieId", authenticateJWT, async (req, res) => {
  try {
    const { score } = req.body;
    const { movieId } = req.params;

    if (!score) {
      return res.status(400).json({ message: "Score is required" });
    }

    const [rating] = await Rating.upsert({
      userId: req.user.id,
      movieId,
      score,
    }, { returning: true });

    res.json(rating);
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Error saving rating", error: error.message });
  }
});

// GET /api/ratings/:movieId
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;

    const ratings = await Rating.findAll({ where: { movieId } });
    const average =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : null;

    res.json({ average, count: ratings.length });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Error fetching ratings", error: error.message });
  }
});

module.exports = router;