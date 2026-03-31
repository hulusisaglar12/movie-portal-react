import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails, fetchMovieCredits } from "../../Api/Tmdb";
import MovieDetails from "../../Components/MovieDetails/MovieDetails";

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  // Bug fix: id added to dependency array so data reloads if the route id changes
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