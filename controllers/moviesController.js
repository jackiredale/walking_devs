const movies = require("../movies.json");
const {
  filterAndSortMovies,
  getMovieRating,
  getMovieSubgenres,
  getMovieYear
} = require("../utils/movieHelpers");

function getMovies(req, res) {
  const allowedSortValues = [
    "title-asc",
    "title-desc",
    "rating-desc",
    "rating-asc",
    "year-desc",
    "year-asc"
  ];

  if (req.query.sort && !allowedSortValues.includes(req.query.sort)) {
    return res.status(400).json({
      error: "Invalid sort value",
      allowedSortValues
    });
  }

  const results = filterAndSortMovies(movies, req.query);

  res.json({
    count: results.length,
    appliedQuery: req.query,
    movies: results
  });
}

function getRandomMovie(req, res) {
  const matchingMovies = filterAndSortMovies(movies, req.query);

  if (matchingMovies.length === 0) {
    return res.status(404).json({
      error: "No movies matched the supplied filters"
    });
  }

  const randomIndex = Math.floor(Math.random() * matchingMovies.length);
  res.json(matchingMovies[randomIndex]);
}

function getFilterOptions(req, res) {
  const subgenres = [
    ...new Set(movies.flatMap((movie) => getMovieSubgenres(movie)))
  ].sort();

  const decades = [
    ...new Set(
      movies.map((movie) => Math.floor(getMovieYear(movie) / 10) * 10)
    )
  ].filter(Boolean).sort((a, b) => a - b);

  const ratings = movies.map(getMovieRating).filter((rating) => rating > 0);

  res.json({
    subgenres,
    decades,
    ratingRange: {
      minimum: ratings.length ? Math.min(...ratings) : null,
      maximum: ratings.length ? Math.max(...ratings) : null
    },
    sortOptions: [
      { label: "Title A to Z", value: "title-asc" },
      { label: "Title Z to A", value: "title-desc" },
      { label: "Highest Rated", value: "rating-desc" },
      { label: "Lowest Rated", value: "rating-asc" },
      { label: "Newest First", value: "year-desc" },
      { label: "Oldest First", value: "year-asc" }
    ]
  });
}

module.exports = {
  getMovies,
  getRandomMovie,
  getFilterOptions
};
