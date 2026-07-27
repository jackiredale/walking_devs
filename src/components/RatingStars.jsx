import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function RatingStars({ movieId, initialAverage = 0 }) {
  const [score, setScore] = useState(0);
  const [average, setAverage] = useState(initialAverage);
  const [error, setError] = useState(null);

  const handleRate = async (value) => {
    setScore(value);
    try {
      await apiFetch(`/movies/${movieId}/rate`, {
        method: "POST",
        body: JSON.stringify({ score: value }),
      });
      const updated = await apiFetch(`/movies/${movieId}/ratings`);
      setAverage(updated.average);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRate(star)}
          className={star <= score ? "star filled" : "star"}
        >
          ★
        </span>
      ))}
      <span className="average">Avg: {average ? Number(average).toFixed(1) : "N/A"}</span>
      {error && <p className="error">{error}</p>}
    </div>
  );
}