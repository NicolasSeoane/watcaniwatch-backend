import { getAIRecommendedMovies } from "../services/ai.service.js";

export const searchMoviesWithAI = async (req, res, next) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const movies = await getAIRecommendedMovies(prompt);

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error on searchMoviesWithAI:", error);
    res.status(500).json({ error: "Error getting AI recomendations" });
  }
};