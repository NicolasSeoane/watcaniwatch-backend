import { Favorite } from "../models/Favorite.js";

export const addFavorite = async (req, res, next) => {
  try {
    const { itemId, type, title, poster_path } = req.body;

    // evitar duplicados
    const existing = await Favorite.findOne({ userId: req.user._id, itemId });
    if (existing) {
      return res.status(400).json({ message: "Already on favorites" });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      itemId,
      type,
      title,
      poster_path,
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!fav) return res.status(404).json({ message: "Favorite not found" });

    res.json({ message: "Favorite deleted succesfully" });
  } catch (error) {
    next(error);
  }
};