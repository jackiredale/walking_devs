import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContext';
import ErrorMessage from './ErrorMessage';
import './MovieList.css';
import './ErrorMessage.css';
import ghost from "../assets/ghost.svg";

function MovieList() {
  const { data, baseImageUrl, seededMovies, currentPage, setCurrentPage, error } = useStateContext();

  const formattedSeededMovies = seededMovies.map((movie) => ({
    id: movie.tmdbId,
    poster_path: movie.posterUrl,
    title: movie.title,
    release_date: String(movie.releaseYear),
  }));

  const moviesPerPage = 12; // Number of movies to display per page
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const movies = formattedSeededMovies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(formattedSeededMovies.length / moviesPerPage);

  if (error) {
    return <ErrorMessage />;
  }

  if (formattedSeededMovies.length === 0) {
    return <div className="no-movies-message">

    {/* Spiders dangling and floating on their threads */}
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

    {/* Main content: tagline, floating ghost, headline */}
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
      <div className="movie-grid">
      {movies.map((movie) => (
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

  );
}

export default MovieList;
