const API_KEY = "cb0f4b60c26fa9cfd2638a5ecff9d759";
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTopRated(page = 1) {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
  );
  return res.json();
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return res.json();
}

export async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.json();
}

export async function fetchMovieCredits(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
  );
  return res.json();
}