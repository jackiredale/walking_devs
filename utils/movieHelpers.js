function normaliseText(value) {
  return String(value || "").trim().toLowerCase();
}

function getMovieYear(movie) {
  return Number(movie.releaseYear || movie.year || 0);
}

function getMovieRating(movie) {
  return Number(movie.averageRating || movie.rating || 0);
}

function getMovieSubgenres(movie) {
  const categories = Array.isArray(movie.categories) ? movie.categories : [];

  return categories
    .filter((category) => normaliseText(category) !== "horror")
    .map(normaliseText);
}

function matchesSearch(movie, search) {
  if (!search) return true;

  const searchText = normaliseText(search);
  const searchableFields = [
    movie.title,
    movie.description,
    movie.director,
    ...(Array.isArray(movie.categories) ? movie.categories : [])
  ];

  return searchableFields.some((field) => normaliseText(field).includes(searchText));
}

function matchesSubgenre(movie, subgenre) {
  if (!subgenre) return true;
  return getMovieSubgenres(movie).includes(normaliseText(subgenre));
}

function matchesDecade(movie, decade) {
  if (!decade) return true;

  const decadeNumber = Number(decade);
  if (!Number.isInteger(decadeNumber)) return false;

  const year = getMovieYear(movie);
  return year >= decadeNumber && year <= decadeNumber + 9;
}

function matchesMinimumRating(movie, minRating) {
  if (minRating === undefined || minRating === "") return true;

  const ratingNumber = Number(minRating);
  if (Number.isNaN(ratingNumber)) return false;

  return getMovieRating(movie) >= ratingNumber;
}

function sortMovies(movies, sort) {
  const sortedMovies = [...movies];

  const sortFunctions = {
    "title-asc": (a, b) => String(a.title).localeCompare(String(b.title)),
    "title-desc": (a, b) => String(b.title).localeCompare(String(a.title)),
    "rating-desc": (a, b) => getMovieRating(b) - getMovieRating(a),
    "rating-asc": (a, b) => getMovieRating(a) - getMovieRating(b),
    "year-desc": (a, b) => getMovieYear(b) - getMovieYear(a),
    "year-asc": (a, b) => getMovieYear(a) - getMovieYear(b)
  };

  if (sort && sortFunctions[sort]) {
    sortedMovies.sort(sortFunctions[sort]);
  }

  return sortedMovies;
}

function filterAndSortMovies(movies, query) {
  const { search, subgenre, decade, minRating, sort } = query;

  const filteredMovies = movies.filter((movie) => {
    return (
      matchesSearch(movie, search) &&
      matchesSubgenre(movie, subgenre) &&
      matchesDecade(movie, decade) &&
      matchesMinimumRating(movie, minRating)
    );
  });

  return sortMovies(filteredMovies, sort);
}

module.exports = {
  filterAndSortMovies,
  getMovieRating,
  getMovieSubgenres,
  getMovieYear
};
