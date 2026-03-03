import express from "express";
import { protect } from "../middleware/auth.js";
import { submitRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/", protect, submitRating);

export default router;
