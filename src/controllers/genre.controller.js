import { fetchAllGenres } from "../services/tmdb.service.js";

export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await fetchAllGenres();
    res.json(genres);
  } catch (error) {
    next(error); // pasa al middleware de errores
  }
};