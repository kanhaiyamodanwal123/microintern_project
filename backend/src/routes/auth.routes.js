import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", upload.fields([
  { name: "companyRegistrationDoc", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
]), register);

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
export default router;
