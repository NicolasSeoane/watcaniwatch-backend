import express from "express";
import { HealthController } from "../controllers/health.controller.js";

const router = express.Router();

router.get('/ping', HealthController);

export default router;
