import express from "express";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../controllers/favorite.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addFavorite);

router.get("/", protect, getUserFavorites);

router.delete("/:id", protect, removeFavorite);

export default router;
