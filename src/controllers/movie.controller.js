import { fetchPopularMovies, fetchTrendingMovies, fetchMovieById, fetchRandomMovie, fetchFilteredMovie, fetchMoviesByQuery } from "../services/tmdb.service.js";

export const getPopularMovies = async (req, res, next) => {
  const page = parseInt(req.query.page);
  try {
    const movies = await fetchPopularMovies(page);
    res.json(movies);
  } catch (error) {
    next(error); // pasa al middleware de errores
  }
};

export const getTrendingMovies = async (req, res, next) => {
  try {
    const movies = await fetchTrendingMovies();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await fetchMovieById(id);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

export const getRandomMovie = async (req, res, next) => {
  try {
    const movieId = await fetchRandomMovie();
    res.status(200).json(movieId);
  } catch (error) {
    console.error("Error al obtener película random:", error.message);
    next(error);
  }
};


export const getFilteredMovie = async (req, res, next) => {
  try {
    const { genre, minRating, minYear, maxYear } = req.query;
    const movie = await fetchFilteredMovie({ genre, minRating, minYear, maxYear });
    res.status(200).json(movie);
  } catch (error) {
    if (error.message.includes("No movies found")) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const getMoviesByQuery = async (req, res, next) => {
  try {
    const { query } = req.query;
    const movies = await fetchMoviesByQuery(query);
    res.status(200).json(movies);
  } catch (error) {
    if (error.message.includes("No movies found")) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
}