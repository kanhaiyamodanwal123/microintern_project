import express from "express";
import { protect } from "../middleware/auth.js";
import { getPortfolio } from "../controllers/portfolio.controller.js";

const router = express.Router();

router.get("/", protect, getPortfolio);

export default router;
