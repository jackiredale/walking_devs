import { useEffect, useState } from "react";
import "./Home.css";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const posterUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;
const filters = ["All", "Silent Era", "Slasher", "Supernatural", "Occult", "Zombie", "Psychological", "Body Horror", "Folk Horror"];

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&sort_by=popularity.desc`)
      .then((res) => res.json())
      .then((data) => setMovies((data.results || []).filter((movie) => movie.poster_path).slice(0, 13)))
      .catch(console.error);
  }, []);

  const featured = movies[0];
  const movieCards = movies.slice(1);

  return (
    <main className="homepage">
      <header className="site-header">
        <div>
          <h1>Archive of Shadows</h1>
          <p>by the walking devs</p>
        </div>
        <nav>
          <a href="/">Series</a>
          <a href="/">Films</a>
          <a href="/login">Register</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <section className="filter-nav">
        <button type="button">Filter</button>
        {filters.map((filter) => <button type="button" key={filter}>{filter}</button>)}
      </section>

      <form className="search-bar">
        <input placeholder="Search term" />
        <select><option>Year</option></select>
        <select><option>Genre</option></select>
        <select><option>Rating</option></select>
        <select><option>Sort by</option></select>
        <button type="submit">Search</button>
      </form>

      {featured && (
        <section className="featured-movie">
          <p>Featured discovery</p>
          <img src={posterUrl(featured.poster_path)} alt={featured.title} />
          <div>
            <p>Horror</p>
            <h2>{featured.title}</h2>
            <p>{featured.overview}</p>
            <p>{featured.release_date?.slice(0, 4)} · Rating {featured.vote_average?.toFixed(1)}</p>
            <button type="button">View entry</button>
          </div>
        </section>
      )}

      <section className="movie-grid">
        {movieCards.map((movie) => (
          <article className="movie-card" key={movie.id}>
            <img src={posterUrl(movie.poster_path)} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.slice(0, 4)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
