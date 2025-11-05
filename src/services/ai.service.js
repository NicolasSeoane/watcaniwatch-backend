import OpenAI from "openai";
import { ENV } from "../config/env.js";
import { fetchMovieByTitle } from "./tmdb.service.js";
import { enrichPrompt } from "../utils/openai.js";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export const getAIRecommendedMovies = async (prompt) => {
  const systemPrompt = `
  You are a movie expert. Given a user request, recommend 5 movies that fit the tone, genre, era, or actors mentioned. 
  The IMDB score must be at least 3/10 stars and have a minimum of 100 votes.
Respond only in JSON format with this schema:
{
  "movies": [
    { "title": "Movie name", "year": "year" }
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: enrichPrompt(prompt) },
    ],
    temperature: 0.8,
  });

  const content = completion.choices[0].message?.content;

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error("Error parsing JSON from OpenAI:", content);
    throw new Error("Invalid response from AI model");
  }

  const results = [];
  for (const movie of parsed.movies) {
    const found = await fetchMovieByTitle(movie.title, movie.year);
    if (found) results.push(found);
  }

  return results;
};
