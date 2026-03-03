import express from "express";
import { protect } from "../middleware/auth.js";
import { getMessages, saveMessage, getMyConversations } from "../controllers/message.controller.js";

const router = express.Router();

// Get messages for a specific task (only employer or accepted student)
router.get("/:taskId", protect, getMessages);

// Send a message (only employer or accepted student)
router.post("/", protect, saveMessage);

// Get all conversations for current user
router.get("/", protect, getMyConversations);

export default router;
