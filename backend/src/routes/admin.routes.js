import express from "express";
import {
  getPendingStudents,
  getPendingEmployers,
  getAllUsers,
  getAllTasks,
  approveStudent,
  rejectStudent,
  approveEmployer,
  rejectEmployer,
  deleteUser,
  deleteTask,
  getStats,
} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

// Stats
router.get("/stats", protect, isAdmin, getStats);

// Users
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/user/:id", protect, isAdmin, deleteUser);

// Pending verifications
router.get("/pending/students", protect, isAdmin, getPendingStudents);
router.get("/pending/employers", protect, isAdmin, getPendingEmployers);

// Student verification
router.post("/student/approve/:id", protect, isAdmin, approveStudent);
router.post("/student/reject/:id", protect, isAdmin, rejectStudent);

// Employer verification
router.post("/employer/approve/:id", protect, isAdmin, approveEmployer);
router.post("/employer/reject/:id", protect, isAdmin, rejectEmployer);

// Task management
router.get("/tasks", protect, isAdmin, getAllTasks);
router.delete("/task/:id", protect, isAdmin, deleteTask);

export default router;
