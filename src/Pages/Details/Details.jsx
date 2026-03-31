import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails, fetchMovieCredits } from "../../Api/Tmdb";
import MovieDetails from "../../Components/MovieDetails/MovieDetails";

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  // ASSIGNMENT 4 — BUG FIX: Original code had empty dependency array [].
  // This meant the movie data never reloaded when navigating between movies.
  // Fixed by adding id to the dependency array so it re-fetches when the route changes.
  useEffect(() => {
    loadMovie();
    loadCast();
  }, [id]);

  async function loadMovie() {
    const data = await fetchMovieDetails(id);
    setMovie(data);
  }

  async function loadCast() {
    const data = await fetchMovieCredits(id);
    setCast(data.cast.slice(0, 10));
  }

  if (!movie) return <div>Loading...</div>;

  return (
    <MovieDetails
      movie={movie}
      cast={cast}
      onBack={() => navigate(-1)}
    />
  );
}

export default Details;