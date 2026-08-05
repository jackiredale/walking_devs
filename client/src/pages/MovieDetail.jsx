import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import WatchlistButton from "../components/WatchListButton";
import "./MovieDetail.css";

const TMDB_API_KEY = import.meta.env.VITE_MOVIE_API_KEY || import.meta.env.VITE_REACT_APP_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function MovieDetail() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      setError(null);
      setInWatchlist(false);
      setMovie(null);

      try {
        const authToken = localStorage.getItem("authToken");

        const [movieResponse, creditsResponse, items] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`).then((response) => {
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);
            return response.json();
          }),
          fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`).then((response) => {
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);
            return response.json();
          }),
          authToken ? apiFetch("/watchlist").catch(() => []) : Promise.resolve([]),
        ]);

        setMovie({ ...movieResponse, credits: creditsResponse });
        setInWatchlist(items.some((item) => item.tmdbId === movieResponse.id));
      } catch (err) {
        setError(err.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="movie-detail">
        <div className="movie-detail__loading">
          <p className="movie-detail__eyebrow">HOME / FILMS / DETAIL</p>
          <h2>Loading movie details...</h2>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail">
        <div className="movie-detail__loading">
          <p className="movie-detail__eyebrow">HOME / FILMS / DETAIL</p>
          <h2>Movie Not Found</h2>
          <p className="movie-detail__copy-text">{error || "This movie couldn't be loaded."}</p>
          <button onClick={() => navigate("/")} className="btn-watchlist btn-watchlist--solid">
            Back to Films
          </button>
        </div>
      </div>
    );
  }

  const director = movie.credits?.crew?.find((person) => person.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 5) || [];
  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "N/A";
  const backdropPath = movie.backdrop_path || movie.poster_path;
  const genreName = movie.genres?.[0]?.name?.toUpperCase?.() || "FILM";

  return (
    <div className="movie-detail">
      <div className="movie-detail__page">
        <button onClick={() => navigate("/")} className="movie-detail__back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        <div className="movie-detail__panel">
          <div className="movie-detail__layout">
            <div className="movie-detail__art">
              {backdropPath && (
                <div className="movie-detail__art-bg">
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${backdropPath}`}
                    alt=""
                    className="movie-detail__art-bg-image"
                  />
                  <div className="movie-detail__art-bg-overlay" />
                </div>
              )}
              <div className="movie-detail__poster">
                {movie.poster_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-detail__poster-image"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
                  />
                ) : (
                  <div className="movie-detail__poster-empty">
                    <span>No Poster</span>
                  </div>
                )}
              </div>
            </div>

            <div className="movie-detail__copy">
              <p className="movie-detail__eyebrow">HOME / FILMS / {genreName}</p>
              <h1>{movie.title}</h1>
              {director && <p className="movie-detail__director">Director: {director.name}</p>}

              <div className="movie-detail__meta">
                {movie.release_date && (
                  <div className="movie-detail__meta-item">
                    <svg className="movie-detail__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="movie-detail__meta-label">Release Date</span>
                    <span>{releaseYear}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="movie-detail__meta-item">
                    <svg className="movie-detail__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="movie-detail__meta-label">Runtime</span>
                    <span>{runtime}</span>
                  </div>
                )}

                {movie.vote_average !== undefined && (
                  <div className="movie-detail__meta-item">
                    <svg className="movie-detail__meta-icon movie-detail__meta-icon--star" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="movie-detail__meta-label">Rating</span>
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {movie.overview && (
                <section className="movie-detail__section">
                  <h2 className="movie-detail__section-title">It will consume you.</h2>
                  <p className="movie-detail__body">{movie.overview}</p>
                </section>
              )}

              <div className="movie-detail__actions">
                <WatchlistButton
                  movieId={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  initialSaved={inWatchlist}
                />
              </div>

              {cast.length > 0 && (
                <section className="movie-detail__cast">
                  <h2 className="movie-detail__section-title movie-detail__section-title--small">Cast</h2>
                  <div className="movie-detail__cast-strip">
                    {cast.map((person) => (
                      <article key={person.cast_id ?? person.id} className="movie-detail__cast-card">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="movie-detail__cast-image"
                          />
                        ) : (
                          <div className="movie-detail__cast-empty">No Photo</div>
                        )}
                        <p className="movie-detail__cast-name">{person.name}</p>
                        <p className="movie-detail__cast-role">{person.character || "Cast"}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}