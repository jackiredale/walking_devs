const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movies");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Horror Movie Database API",
    moviesEndpoint: "/api/movies",
    filtersEndpoint: "/api/movies/filters",
    randomEndpoint: "/api/movies/random"
  });
});

app.use("/api/movies", movieRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
