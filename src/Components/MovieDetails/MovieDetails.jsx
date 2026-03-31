import styles from "./MovieDetails.module.css";

function MovieDetails({ movie, cast, onBack }) {
  return (
    <div className={styles.container}>
      <button onClick={onBack}>Back</button>

      <h2>{movie.title}</h2>
      <p>Release Year: {movie.release_date?.slice(0, 4)}</p>
      <p>Rating: ⭐ {movie.vote_average}</p>
      <p>{movie.overview}</p>

      <h3>Cast</h3>
      <ul>
        {cast.map((actor) => (
          <li key={actor.cast_id}>
            {actor.name} as {actor.character}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieDetails;