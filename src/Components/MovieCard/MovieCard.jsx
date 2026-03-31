import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";

const PLACEHOLDER = "https://via.placeholder.com/200x300?text=No+Image";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  // useCallback prevents a new function being created on every render
  const handleClick = useCallback(() => {
    navigate(`/movie/${movie.id}`);
  }, [navigate, movie.id]);

  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : PLACEHOLDER;

  return (
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

// memo prevents re-render when parent re-renders but this card's movie prop hasn't changed
export default memo(MovieCard);