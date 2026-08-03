import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./WatchListButton.css";

export default function WatchlistButton({ movieId, title, posterPath, initialSaved = false }) {
  const [saved, setSaved] = useState(initialSaved);
  const navigate = useNavigate();

  const toggle = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      if (saved) {
        await apiFetch(`/watchlist/${movieId}`, { method: "DELETE" });
      } else {
        await apiFetch("/watchlist", {
          method: "POST",
          body: JSON.stringify({
            tmdbId: movieId,
            title,
            posterPath,
          }),
        });
      }
      setSaved((current) => !current);
    } catch (err) {
      console.error("Watchlist error:", err.message);
    }
  };

  return <button className={saved ? "btn-watchlist active" : "btn-watchlist"} onClick={toggle}>{saved ? "★ In Watchlist" : "+ Add to Watchlist"}</button>;
}
