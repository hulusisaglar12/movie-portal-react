// ASSIGNMENT 4 — added useMemo and useCallback imports for performance optimization
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  fetchTopRated,
  searchMovies,
  fetchGenres,
} from "../../Api/Tmdb";
import MovieCard from "../../Components/MovieCard/MovieCard";
import styles from "./Home.module.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      loadTopRated(page);
    } else {
      loadSearch(query, page);
    }
  }, [page, query]);

  async function loadTopRated(pageNumber) {
    const data = await fetchTopRated(pageNumber);
    setMovies(data.results);
  }

  async function loadSearch(text, pageNumber) {
    const data = await searchMovies(text, pageNumber);
    setMovies(data.results);
  }

  async function loadGenres() {
    const data = await fetchGenres();
    setGenres(data.genres);
  }

  // ASSIGNMENT 4 — PERFORMANCE: useCallback gives all handlers stable references
  // so child components do not re-render unnecessarily
  const handleSearch = useCallback((text) => {
    setQuery(text);
    setPage(1);

    if (text.trim() === "") {
      loadTopRated(1);
      return;
    }

    searchMovies(text, 1).then((data) => setMovies(data.results));
  }, []);

  const handleGenreChange = useCallback((e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  }, []);

  const handlePrevPage = useCallback(() => setPage((p) => p - 1), []);
  const handleNextPage = useCallback(() => setPage((p) => p + 1), []);

  // ASSIGNMENT 4 — PERFORMANCE: useMemo avoids re-filtering the movie list on every render.
  // Only recomputes when movies or selectedGenre actually changes.
  const filteredMovies = useMemo(
    () =>
      selectedGenre
        ? movies.filter((m) => m.genre_ids.includes(Number(selectedGenre)))
        : movies,
    [movies, selectedGenre]
  );

  return (
    <div className={styles.container}>
      <h1>Movie Portal</h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className={styles.search}
        aria-label="Search movies" // ASSIGNMENT 4 — ACCESSIBILITY
      />

      <select
        value={selectedGenre}
        onChange={handleGenreChange}
        className={styles.dropdown}
        aria-label="Filter by genre" // ASSIGNMENT 4 — ACCESSIBILITY
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <div className={styles.list}>
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>

        <span>Page {page}</span>

        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default Home;