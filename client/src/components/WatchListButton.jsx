import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function WatchlistButton({ movieId, initialSaved = false }) {
  const [saved, setSaved] = useState(initialSaved);

  const toggle = async () => {
    try {
      if (saved) {
        await apiFetch(`/watchlist/${movieId}`, { method: "DELETE" });
      } else {
        await apiFetch(`/watchlist/${movieId}`, { method: "POST" });
      }
      setSaved(!saved);
    } catch (err) {
      console.error("Watchlist error:", err.message);
    }
  };

  return (
    <button className={saved ? "btn-watchlist active" : "btn-watchlist"} onClick={toggle}>
      {saved ? "★ In Watchlist" : "+ Add to Watchlist"}
    </button>
  );
}