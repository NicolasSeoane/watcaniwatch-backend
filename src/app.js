import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import userRoutes from "./routes/user.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import genresRoutes from "./routes/genres.routes.js";
import healthRoute from "./routes/health.route.js";
import aiRoutes from "./routes/ai.routes.js"
import authRoutes from "./routes/auth.Routes.js"
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";


const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ENV.FRONT_URL, // front
  credentials: true, // permite cookies o headers de auth
}));
app.use(helmet());
app.use(morgan("dev"));

// Conexion DB
connectDB();

// Rutas
app.use('/api/health', healthRoute);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes)

app.use(errorHandler);
export default app;