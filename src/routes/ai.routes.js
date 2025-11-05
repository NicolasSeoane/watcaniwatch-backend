import express from "express";
import { searchMoviesWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/search", searchMoviesWithAI);

export default router;