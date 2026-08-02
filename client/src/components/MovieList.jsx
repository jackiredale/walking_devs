import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContext';
import './MovieList.css'

function MovieList() {
  const { data, baseImageUrl, seededMovies } = useStateContext();

  const formattedSeededMovies = seededMovies.map((movie) => ({
    id: movie.tmdbId,
    poster_path: movie.posterUrl,
    title: movie.title,
    release_date: String(movie.releaseYear),
  }));

  const movies = formattedSeededMovies.slice(0,12);

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
