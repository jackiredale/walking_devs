import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContext';
import ErrorMessage from './ErrorMessage';
import './MovieList.css';
import './ErrorMessage.css';
import ghost from "../assets/ghost.svg";

function MovieList() {
 const { seededMovies, currentPage, setCurrentPage, error } = useStateContext();

const liveMovies = seededMovies || [];
console.log("seededMovies:", seededMovies);
console.log("error:", error);

  const moviesPerPage = 12;
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const pagedLiveMovies = liveMovies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(liveMovies.length / moviesPerPage);

  if (error) {
    return <ErrorMessage />;
  }

  if (liveMovies.length === 0) {
    return <div className="no-movies-message">

    <div className="spider spider-1">
      <div className="eye left"></div>
      <div className="eye right"></div>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
    </div>

    <div className="spider spider-2">
      <div className="eye left"></div>
      <div className="eye right"></div>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
    </div>

    <div className="spider spider-3">
      <div className="eye left"></div>
      <div className="eye right"></div>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
    </div>

    <div className="spider spider-4">
      <div className="eye left"></div>
      <div className="eye right"></div>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg left"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
      <span className="leg right"></span>
    </div>

    <div className="content">
      <p className="tagline">Muahahahaha!</p>

      <div className="ghost-wrap">
        <div className="ghost-tilt">
          <img src={ghost} alt="Grinning ghost" className="ghost-img" />
        </div>
      </div>

      <h1 className="title">
        <span className="line-small">No Movies Found</span>
      </h1>
    </div>

  </div>;
  }

  return (
    <div className="movie-list-page">
      <div className="movie-grid">
        {pagedLiveMovies.map((movie) => (
         <Link key={movie.id} to={`/movie/${movie.tmdbId}`} className="movie-card">
  {movie.posterUrl && (
    <img
      src={movie.posterUrl}
      alt={movie.title}
    />
  )}
  <h3 className="movie-title">{movie.title}</h3>
  <p className="movie-year">{movie.releaseYear}</p>
</Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieList;