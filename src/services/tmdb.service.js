import axios from "axios";
import { ENV } from "../config/env.js";

const TMDB_BASE_URL = ENV.TMDB_BASE_URL;
const TMDB_API_KEY = ENV.TMDB_API_KEY;
export const fetchPopularMovies = async (page) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        language: "en-US",
        page,
      },
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching popular movies:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchTrendingMovies = async () => {
  try {
    // Obtener generos
    const genresResponse = await axios.get(
      `${TMDB_BASE_URL}/genre/movie/list`,
      {
        headers: {
          accept: "application/json",
          Authorization: TMDB_API_KEY,
        },
      }
    );

    const genresList = genresResponse.data.genres;
    const genresMap = Object.fromEntries(genresList.map((g) => [g.id, g.name]));

    // Obtener tendencia
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });

    if (!response || response.data.results.length === 0) {
      throw { status: 404, message: "No trending movies found" };
    }

    const top5 = response.data.results.slice(0, 5);
    return top5.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      genres: movie.genre_ids.map((id) => genresMap[id] || "Unknown"),
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    }));
  } catch (error) {
    console.error(
      "Error fetching trending movies:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchMovieById = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });
    const movie = response.data;
    const videosRes = await getMovieVideos(movie.id);
    const imagesRes = await getMovieImages(movie.id);
    movie.videos = videosRes.data.results;
    movie.images = imagesRes.data;

    return movie;
  } catch (error) {
    console.error(
      "Error fetching movie by ID:",
      error.response?.data || error.message
    );
    throw new Error("Could not fetch movie details");
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMovieImages(movieId) {
  try {
    return axios.get(`${TMDB_BASE_URL}/movie/${movieId}/images`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching movie images:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

function getMovieVideos(movieId) {
  try {
    return axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching movie videos:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function fetchDiscoverPage(page = 1) {
  const { data } = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
    headers: {
      accept: "application/json",
      Authorization: TMDB_API_KEY,
    },
    params: {
      page,
    },
  });

  const filteredMovies = data.results.filter(
    (movie) =>
      movie.vote_count >= 500 && movie.vote_average >= 4.0 && !movie.adult
  );
  return filteredMovies;
}

export const fetchRandomMovie = async () => {
  let results = [];
  let attempts = 0;
  const maxAttempts = 10;

  do {
    const randomPage = randomInt(1, 500); // TMDB tiene max 500 paginas
    const pageData = await fetchDiscoverPage(randomPage);
    results = pageData || [];
    attempts++;
  } while (!results.length && attempts < maxAttempts);

  if (!results.length)
    throw new Error("No se encontraron películas después de varios intentos.");

  const randomIndex = randomInt(0, results.length - 1);
  const randomMovie = results[randomIndex];

  const id = randomMovie.id;
  return id;
};

export const fetchFilteredMovie = async ({
  genre,
  minRating,
  minYear,
  maxYear,
}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
      params: {
        include_adult: false,
        "vote_count.gte": 200,
        "vote_average.gte": minRating,
        "primary_release_date.gte": `${minYear}-01-01`,
        "primary_release_date.lte": `${maxYear}-12-31`,
        with_genres: genre,
      },
    });
    const results = response.data.results;
    if (!results || results.length === 0) {
      const error = new Error("No movies found matching the criteria");
      error.status = 404;
      throw error;
    }
    return results[0];
  } catch (error) {
    console.error("TMDB API error:", error.response?.data || error.message);
    throw new Error(
      error.status === 404 ? error.message : "Could not fetch filtered movies"
    );
  }
};

export const fetchAllGenres = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
    });
    return response.data.genres;
  } catch (error) {
    console.error(
      "Error fetching genres:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchMovieByTitle = async (title, year) => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
      params: {
        query: title,
        //year,
      },
    });

    const movie = res.data.results[0];
    if (!movie) return null;

    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };
  } catch (err) {
    console.error("Error fetching movie from TMDB:", err.message);
    return null;
  }
};

export const fetchMoviesByQuery = async (query) => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_API_KEY,
      },
      params: {
        query: query,
      },
    });

    const movies = res.data.results;
    if (!movies) return null;

    const filteredMovies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }));

    return filteredMovies;
  } catch (err) {
    console.error("Error fetching movie from TMDB:", err.message);
    return null;
  }
};
