import dotenv from "dotenv";

dotenv.config(); 

export const ENV = {
  FRONT_URL: process.env.FRONT_URL,
  MONGO_URI: process.env.MONGO_URI,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};