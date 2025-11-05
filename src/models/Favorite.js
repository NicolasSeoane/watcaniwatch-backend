import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: String, required: true },
  title: String,
  poster_path: String,
}, { timestamps: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);