import express from "express";
import { getAllGenres } from "../controllers/genre.controller.js";

const router = express.Router();
router.get("/all", getAllGenres);

export default router;
