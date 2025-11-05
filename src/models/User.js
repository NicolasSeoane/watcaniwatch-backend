import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, default: null },
    picture: { type: String, default: null },
    provider: { type: String, default: "local" },  // "local" o "google"
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
