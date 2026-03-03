import express from "express";
import { uploadStudentId, uploadEmployerDoc } from "../controllers/verification.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Student upload ID for verification
router.post("/upload-id", protect, upload.single("id"), uploadStudentId);

// Employer upload company document for verification
router.post("/upload-employer-doc", protect, upload.single("doc"), uploadEmployerDoc);

export default router;
