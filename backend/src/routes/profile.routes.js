import express from "express";
import { getProfile, updateProfile, updateProfilePhoto } from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/", protect, getProfile);

router.put(
  "/",
  protect,
  upload.fields([
    { name: "collegeIdCard", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  updateProfile
);

// Separate route for photo upload (returns Cloudinary URL)
router.put(
  "/photo",
  protect,
  upload.single("photo"),
  updateProfilePhoto
);

export default router;
