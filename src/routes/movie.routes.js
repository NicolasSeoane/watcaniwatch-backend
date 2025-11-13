import express from "express";
import { getPopularMovies, getTrendingMovies, getMovieById, getRandomMovie, getFilteredMovie, getMoviesByQuery } from "../controllers/movie.controller.js";

const router = express.Router();
router.get("/popular", getPopularMovies);
router.get("/trending", getTrendingMovies);
router.get("/randomMovie", getRandomMovie);
router.get("/filteredMovie", getFilteredMovie);
router.get("/search", getMoviesByQuery);
router.get("/:id", getMovieById);

export default router;
