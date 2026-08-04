import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContext';
import './MustWatch.css';

function MustWatch() {
  const { seededMovies, baseImageUrl } = useStateContext();

  const formattedSeededMovies = seededMovies.map((movie) => ({
    id: movie.tmdbId,
    poster_path: movie.posterUrl,
    title: movie.title,
    release_date: String(movie.releaseYear),
  }));

  return (
    <div className="must-watch-page">
      <h1 className="must-watch-page-title">Must-Watch Horror Films</h1>
      <p className="must-watch-page-subtitle">Our curated picks — the essentials chosen by the walking devs.</p>

      {formattedSeededMovies.length === 0 ? (
        <p className="must-watch-empty">No must-watch films yet.</p>
      ) : (
        <div className="movie-grid">
          {formattedSeededMovies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
              {movie.poster_path && (
                <img
                  src={movie.poster_path.startsWith('http') ? movie.poster_path : `${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title}
                />
              )}
              <h3 className='movie-title'>{movie.title}</h3>
              <p className='movie-year'>{movie.release_date?.slice(0, 4)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MustWatch;