import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Films.css";
import { apiFetch } from "../utils/api";


const SUBGENRES = [
  "All",
  "Slasher",
  "Supernatural",
  "Occult",
  "Zombie",
  "Psychological",
  "Body Horror",
  "Folk Horror",
];

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Rating", value: "vote_average.desc" },
  { label: "Newest", value: "primary_release_date.desc" },
  { label: "Oldest", value: "primary_release_date.asc" },
];

const DECADES = [1970, 1980, 1990, 2000, 2010, 2020];

export default function Films() {
  const [searchTerm, setSearchTerm] = useState("");
  const [decade, setDecade] = useState("");
  const [subgenre, setSubgenre] = useState("All");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (decade) {
      params.set("decade", decade);
    }

    if (subgenre !== "All") {
      params.set("subgenre", subgenre);
    }

    if (minRating) {
      params.set("minRating", minRating);
    }

    const queryString = params.toString();
    const data = await apiFetch(
      `/movies${queryString ? `?${queryString}` : ""}`
    );

    let results = Array.isArray(data.movies) ? [...data.movies] : [];

    if (sortBy === "vote_average.desc") {
      results.sort(
        (a, b) => Number(b.averageRating) - Number(a.averageRating)
      );
    }

    if (sortBy === "primary_release_date.desc") {
      results.sort((a, b) => b.releaseYear - a.releaseYear);
    }

    if (sortBy === "primary_release_date.asc") {
      results.sort((a, b) => a.releaseYear - b.releaseYear);
    }

    setMovies(results);
  } catch (err) {
    setError(err.message || "Error fetching movies");
  } finally {
    setLoading(false);
  }
}, [searchTerm, decade, subgenre, minRating, sortBy]);

useEffect(() => {
  fetchMovies();
}, [fetchMovies]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="films-page">
      <div className="films-filters">
        <form className="films-search" onSubmit={handleSearchSubmit}>
          <div className="films-field">
            <label>Search Term</label>
            <input
              type="text"
              placeholder="What do you want to watch?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="films-field">
            <label>Decade</label>
            <select value={decade} onChange={(e) => setDecade(e.target.value)}>
              <option value="">Decade</option>
              {DECADES.map((d) => (
                <option key={d} value={d}>
                  {d}s
                </option>
              ))}
            </select>
          </div>

          <div className="films-field">
            <label>Genre</label>
            <select value={subgenre} onChange={(e) => setSubgenre(e.target.value)}>
              {SUBGENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="films-field">
            <label>Rating</label>
            <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">Rating</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
              <option value="9">9+</option>
            </select>
          </div>

          <div className="films-field">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="films-search-btn">
            Search →
          </button>
        </form>

        <div className="films-pills">
          {SUBGENRES.map((g) => (
            <button
              key={g}
              className={subgenre === g ? "films-pill active" : "films-pill"}
              onClick={() => setSubgenre(g)}
              type="button"
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="films-results">
        {loading && <p className="films-status">Loading movies...</p>}
        {error && <p className="films-status films-status--error">{error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p className="films-status">No movies found. Try different filters.</p>
        )}

        <div className="films-grid">
          {movies.map((movie) => (
     <Link
  to={`/movie/${movie.tmdbId}`}
  key={movie.id}
  className="films-card"
>
  {movie.posterUrl ? (
    <img
      src={movie.posterUrl}
      alt={movie.title}
      className="films-card-poster"
    />
  ) : (
    <div className="films-card-poster films-card-poster--empty">
      No Poster
    </div>
  )}

  <p className="films-card-title">{movie.title}</p>
</Link>
          ))}
        </div>
      </div>
    </div>
  );
}