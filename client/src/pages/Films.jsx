import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Films.css";

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY || import.meta.env.VITE_REACT_APP_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";
const HORROR_GENRE_ID = 27;

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
      let url;

      if (searchTerm.trim()) {
        // Text search ignores decade/genre/rating filters since TMDB's search
        // endpoint doesn't support them the way /discover does.
        url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          searchTerm
        )}`;
      } else {
        const params = new URLSearchParams({
          api_key: TMDB_API_KEY,
          with_genres: HORROR_GENRE_ID,
          sort_by: sortBy,
        });

        if (decade) {
          params.set("primary_release_date.gte", `${decade}-01-01`);
          params.set("primary_release_date.lte", `${Number(decade) + 9}-12-31`);
        }

        if (minRating) {
          params.set("vote_average.gte", minRating);
        }

        if (subgenre !== "All") {
          // Look up TMDB's keyword ID for the subgenre so we can filter by it
          const keywordRes = await fetch(
            `${TMDB_BASE_URL}/search/keyword?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
              subgenre
            )}`
          );
          const keywordData = await keywordRes.json();
          const keywordId = keywordData.results?.[0]?.id;
          if (keywordId) {
            params.set("with_keywords", keywordId);
          }
        }

        url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      // When searching by text, still restrict results to horror
      const results = searchTerm.trim()
        ? data.results.filter((m) => m.genre_ids?.includes(HORROR_GENRE_ID))
        : data.results;

      setMovies(results || []);
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
            <Link to={`/movie/${movie.id}`} key={movie.id} className="films-card">
              {movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="films-card-poster"
                />
              ) : (
                <div className="films-card-poster films-card-poster--empty">No Poster</div>
              )}
              <p className="films-card-title">{movie.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}