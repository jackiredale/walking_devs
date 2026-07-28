import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    apiFetch("/watchlist").then((data) => setMovies(data));
  }, []);

  return (
    <div className="watchlist-page">
      <h2>Your Watchlist</h2>
      {movies.length === 0 && <p>Nothing saved yet.</p>}
      <ul>
        {movies.map((entry) => (
          <li key={entry.Movie.id}>{entry.Movie.title}</li>
        ))}
      </ul>
    </div>
  );
}