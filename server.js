const express = require("express");
const cors = require("cors");
const movies = require("./movies.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get("/api/movies", (req, res) => {
  const { subgenre, decade, minRating, maxRating } = req.query;

  let filteredMovies = [...movies];

  if (subgenre && subgenre.toLowerCase() !== "all") {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.categories.some(
        (category) => category.toLowerCase() === subgenre.toLowerCase()
      )
    );
  }

  if (decade && decade.toLowerCase() !== "all") {
    const decadeStart = Number.parseInt(decade, 10);

    if (Number.isNaN(decadeStart)) {
      return res.status(400).json({
        error: "decade must be a year such as 1980"
      });
    }

    filteredMovies = filteredMovies.filter(
      (movie) =>
        movie.releaseYear >= decadeStart &&
        movie.releaseYear <= decadeStart + 9
    );
  }

  if (minRating !== undefined && minRating !== "") {
    const minimum = Number(minRating);

    if (Number.isNaN(minimum)) {
      return res.status(400).json({ error: "minRating must be a number" });
    }

    filteredMovies = filteredMovies.filter(
      (movie) => movie.averageRating !== null && movie.averageRating >= minimum
    );
  }

  if (maxRating !== undefined && maxRating !== "") {
    const maximum = Number(maxRating);

    if (Number.isNaN(maximum)) {
      return res.status(400).json({ error: "maxRating must be a number" });
    }

    filteredMovies = filteredMovies.filter(
      (movie) => movie.averageRating !== null && movie.averageRating <= maximum
    );
  }

  res.json({
    count: filteredMovies.length,
    movies: filteredMovies
  });
});

app.get("/api/filters", (req, res) => {
  const subgenres = [
    ...new Set(
      movies.flatMap((movie) =>
        movie.categories.filter((category) => category !== "Horror")
      )
    )
  ].sort();

  const decades = [
    ...new Set(
      movies.map((movie) => Math.floor(movie.releaseYear / 10) * 10)
    )
  ].sort((a, b) => a - b);

  res.json({ subgenres, decades, ratingScale: { min: 0, max: 10 } });
});

app.listen(PORT, () => {
  console.log(`Horror movie API running at http://localhost:${PORT}`);
});
