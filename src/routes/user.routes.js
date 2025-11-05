import express from "express";
import { allUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

//TODO USER PROFILE
// router.get("/profile", protect, (req, res) => {
//   res.json(req.user);
// });

router.get("/allUsers", allUsers)

export default router;