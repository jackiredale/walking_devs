const path = require("path");
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes");
const { sequelize } = require("./models");
const { requireAuth } = require("./utils/auth");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3001;
const rebuild = process.argv[2] === "--rebuild";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", routes);

app.get("/protected", requireAuth, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

const clientDistPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API server running.");
  });
}

sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
