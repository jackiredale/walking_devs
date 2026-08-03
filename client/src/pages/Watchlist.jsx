import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./Watchlist.css";

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY || import.meta.env.VITE_REACT_APP_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMovieDetails = async (tmdbId) => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  };

  useEffect(() => {
    let active = true;

    async function loadWatchlist() {
      try {
        setLoading(true);
        setError("");
        const items = await apiFetch("/watchlist");
        if (!active) return;

        if (!Array.isArray(items) || items.length === 0) {
          setMovies([]);
          return;
        }

        const moviePromises = items.map(async (item) => {
          try {
            const movieData = await fetchMovieDetails(item.tmdbId);
            return {
              ...movieData,
              watchlistItemId: item.id,
            };
          } catch (err) {
            console.error(`Error fetching movie ${item.tmdbId}:`, err);
            return null;
          }
        });

        const movieResults = await Promise.all(moviePromises);
        if (!active) return;
        setMovies(movieResults.filter((movie) => movie !== null));
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load watchlist");
        setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadWatchlist();

    return () => {
      active = false;
    };
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemove = async (tmdbId) => {
    await apiFetch(`/watchlist/${tmdbId}`, { method: "DELETE" });
    setMovies((current) => current.filter((movie) => movie.watchlistItemId !== tmdbId));
  };

  if (loading) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-panel watchlist-panel--center">
          <p className="watchlist-page__kicker">Watchlist</p>
          <h2>Loading watchlist...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-panel watchlist-panel--center">
          <p className="watchlist-page__kicker">Watchlist</p>
          <h2>Could not load watchlist</h2>
          <p className="watchlist-page__copy">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-page__header">
        <p className="watchlist-page__kicker">Saved films</p>
        <h2 className="watchlist-page__title">My Watchlist</h2>
      </div>

      {movies.length === 0 && <p>Add Films to you Watchlist.. before you end up on mine!</p>}

      <div className="watchlist-grid">
        {movies.map((movie) => (
          <div key={movie.watchlistItemId} className="watchlist-card" onClick={() => handleMovieClick(movie.id)}>
            <div className="watchlist-card__poster-wrap">
              {movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="watchlist-card__poster"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Poster";
                  }}
                />
              ) : (
                <div className="watchlist-card__poster watchlist-card__poster--empty">
                  <span>No Poster</span>
                </div>
              )}
            </div>

            <div className="watchlist-card__body">
              <h3 className="watchlist-card__title">{movie.title}</h3>
              <div className="watchlist-card__meta">
                <p>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</p>
                <p>{movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A"}</p>
                <p className="watchlist-card__rating-line">
                  ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </p>
              </div>

              <div className="watchlist-card__actions" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleRemove(movie.watchlistItemId)}
                  className="watchlist-card__remove"
                  aria-label={`Remove ${movie.title} from watchlist`}
                >
                  <span className="watchlist-card__remove-heart">♥</span>
                  <span>remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
