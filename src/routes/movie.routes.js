import express from "express";
import { getPopularMovies, getTrendingMovies, getMovieById, getRandomMovie, getFilteredMovie } from "../controllers/movie.controller.js";

const router = express.Router();
router.get("/popular", getPopularMovies);
router.get("/trending", getTrendingMovies);
router.get("/randomMovie", getRandomMovie);
router.get("/filteredMovie", getFilteredMovie);
router.get("/:id", getMovieById);

export default router;
