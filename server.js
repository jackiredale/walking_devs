const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const sequelize = require("./config/connection");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Define User Model
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Define Watchlist Model
const Watchlist = sequelize.define("Watchlist", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  tmdbId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  posterPath: { type: DataTypes.STRING, allowNull: true },
});

app.use(express.json());

// Middleware for authenticating JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username: username || email.split("@")[0],
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ message: "Error creating user", error: error.message });
  }
});

// Login and get a JWT token
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// protected route
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Get the logged-in user's watchlist
app.get("/api/watchlist", authenticateJWT, async (req, res) => {
  try {
    const items = await Watchlist.findAll({ where: { userId: req.user.id } });
    res.json(items);
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    res.status(500).json({ message: "Error fetching watchlist", error: error.message });
  }
});

// Add a movie to the watchlist
app.post("/api/watchlist", authenticateJWT, async (req, res) => {
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

// Remove a movie from the watchlist
app.delete("/api/watchlist/:tmdbId", authenticateJWT, async (req, res) => {
  try {
    await Watchlist.destroy({
      where: { userId: req.user.id, tmdbId: req.params.tmdbId },
    });
    res.sendStatus(204);
  } catch (error) {
    console.error("Watchlist delete error:", error);
    res.status(500).json({ message: "Error removing from watchlist", error: error.message });
  }
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.htm");
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});