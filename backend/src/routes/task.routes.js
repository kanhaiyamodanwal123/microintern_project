import express from "express";
import {
  createTask,
  applyTask,
  getEmployerTasks,
  updateApplicantStatus,
  getStudentApplications,
  submitTask,
  completeTask,
  deleteTask,
  getTaskById,
  updateTask,
  publicTasks,
  getTasks,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.js";
import { isVerifiedStudent } from "../middleware/verifiedStudent.js";
import { isEmployer, canPostTask } from "../middleware/employer.js";
import { isStudent } from "../middleware/student.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/public", publicTasks);

/* ================= EMPLOYER ================= */
// Check if user is employer AND verified
router.get("/employer", protect, isEmployer, getEmployerTasks);
// Only verified employers can create tasks
router.post("/", protect, canPostTask, createTask);
router.post("/status", protect, isEmployer, updateApplicantStatus);
router.post("/complete/:id", protect, isEmployer, completeTask);

/* ================= STUDENT ================= */
router.get("/", protect, getTasks);

// Only students can apply (not employers or admins)
router.post(
  "/apply/:id",
  protect,
  isStudent,
  isVerifiedStudent,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  applyTask
);

router.get("/student", protect, getStudentApplications);
router.post("/submit/:id", protect, isStudent, submitTask);

/* ================= ID ROUTES (ALWAYS LAST) ================= */
router.get("/:id", getTaskById);
router.put("/:id", protect, isEmployer, updateTask);
router.delete("/:id", protect, isEmployer, deleteTask);

export default router;
