// ASSIGNMENT 4 — added memo and useCallback imports for performance optimization
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";

// ASSIGNMENT 4 — BUG FIX: poster_path can be null from the API, causing a broken image.
// Added a placeholder fallback to handle missing posters.
const PLACEHOLDER = "https://via.placeholder.com/200x300?text=No+Image";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  // ASSIGNMENT 4 — PERFORMANCE: useCallback ensures this function is not recreated on every render
  const handleClick = useCallback(() => {
    navigate(`/movie/${movie.id}`);
  }, [navigate, movie.id]);

  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : PLACEHOLDER;

  return (
    // ASSIGNMENT 4 — ACCESSIBILITY: added role, tabIndex, aria-label, and onKeyDown for keyboard navigation
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <img src={posterSrc} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.release_date?.slice(0, 4)}</p>
      <p>⭐ {movie.vote_average?.toFixed(1)}</p>
    </div>
  );
}

// ASSIGNMENT 4 — PERFORMANCE: memo prevents this component re-rendering when the parent
// re-renders but this card's movie prop has not changed
export default memo(MovieCard);