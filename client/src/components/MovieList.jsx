import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContext';
import './MovieList.css'

function MovieList() {
  const { data, baseImageUrl } = useStateContext();
  const movies = data.results || [];

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
        <img
          key={movie.id}
          src={`${baseImageUrl}${movie.poster_path}`}
          alt={movie.title}
        />
         <h3>{movie.title}</h3>
         <p>{movie.release_date?.slice(0, 4)}</p>
         </Link>
      ))}
    </div>
  );
}


export default MovieList;
