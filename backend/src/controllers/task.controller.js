import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

import Task from "../models/Task.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import { createNotification } from "../utils/notify.js";

/* ================= CREATE TASK ================= */
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      employer: req.user.id,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create task" });
  }
};

/* ================= EMPLOYER TASKS ================= */
export const getEmployerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ employer: req.user.id })
      .populate("applicants.student", "name email isVerifiedStudent");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load employer tasks" });
  }
};

/* ================= STUDENT APPLICATIONS ================= */
export const getStudentApplications = async (req, res) => {
  try {
    const tasks = await Task.find({
      "applicants.student": req.user.id,
    }).populate("employer", "name email");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load applications" });
  }
};

/* ================= APPLY TASK ================= */

export const applyTask = async (req, res) => {
  try {
    // Check if user is employer - employers cannot apply
    const applyingUser = await User.findById(req.user.id);
    if (applyingUser.role === "employer") {
      return res.status(403).json({ msg: "Employers cannot apply to internships" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const alreadyApplied = task.applicants.some(
      a => a.student.toString() === req.user.id.toString()
    );

    if (alreadyApplied) {
      return res.status(409).json({
        msg: "You have already applied to this internship",
      });
    }

    // Check if student has an active internship (accepted/in_progress) within 10 days
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Find if student has any accepted/in_progress application
    const activeTasks = await Task.find({
      "applicants.student": req.user.id,
      "applicants.status": { $in: ["accepted", "in_progress"] }
    });

    for (const task of activeTasks) {
      const applicant = task.applicants.find(
        a => a.student.toString() === req.user.id.toString()
      );
      
      // If task is completed, student can apply
      if (task.status === "completed") {
        continue;
      }
      
      // If applicant has acceptedAt date and less than 10 days passed, block
      if (applicant && applicant.acceptedAt) {
        const acceptedDate = new Date(applicant.acceptedAt);
        const daysSinceAccepted = Math.floor(
          (new Date() - acceptedDate) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceAccepted < 10) {
          return res.status(403).json({ 
            msg: `You cannot apply to a new internship. You have an active internship that started ${daysSinceAccepted} days ago. You can apply again after ${10 - daysSinceAccepted} days or upon completion of your current internship.`
          });
        }
      } else {
        // No acceptedAt date (old data before this update) - block to be safe
        return res.status(403).json({ 
          msg: "You cannot apply to a new internship. You have an active internship. Please complete it before applying to another one."
        });
      }
    }

    const student = await User.findById(req.user.id);
    if (!student)
      return res.status(404).json({ msg: "Student not found" });

    const profile = await Profile.findOne({ student: req.user.id });

    let resumeUrl = null;
    let photoUrl = null;

    /* ===================== RESUME UPLOAD ===================== */
    if (req.files?.resume?.[0]) {
      const resumeFile = req.files.resume[0];

      const resumeBase64 = resumeFile.buffer.toString("base64");

      const resumeUpload = await cloudinary.uploader.upload(
        `data:${resumeFile.mimetype};base64,${resumeBase64}`,
        {
          resource_type: "raw",
          folder: "microintern/resumes",
          public_id: `resume_${req.user.id}_${Date.now()}`,
        }
      );

      resumeUrl = resumeUpload.secure_url;
    }

    /* ===================== PHOTO UPLOAD ===================== */
    if (req.files?.photo?.[0]) {
      const photoFile = req.files.photo[0];

      const photoBase64 = photoFile.buffer.toString("base64");

      const photoUpload = await cloudinary.uploader.upload(
        `data:${photoFile.mimetype};base64,${photoBase64}`,
        {
          resource_type: "image",
          folder: "microintern/photos",
          public_id: `photo_${req.user.id}_${Date.now()}`,
        }
      );

      photoUrl = photoUpload.secure_url;
    }

    /* ===================== SNAPSHOT ===================== */
    const snapshot = {
      // BASIC
      name: req.body.name?.trim() || profile?.name || student.name,
      age: req.body.age || profile?.age,
      phone: req.body.phone?.trim() || profile?.phone,
      address: req.body.address?.trim() || profile?.address,

      // EDUCATION
      collegeName: req.body.collegeName || profile?.collegeName,
      collegeEmail: req.body.collegeEmail || profile?.collegeEmail,

      // SKILLS & BIO
      skills: req.body.skills
        ? req.body.skills.split(",").map(s => s.trim())
        : profile?.skills || [],
      bio: req.body.bio || profile?.bio,

      // LINKS
      github: req.body.github || profile?.github,
      linkedin: req.body.linkedin || profile?.linkedin,
      project: req.body.project || profile?.project,

      // FILES (IMPORTANT)
      resume: resumeUrl || profile?.resume,
      photo: photoUrl || profile?.photo,

      // VERIFICATION
      verified: student.isVerifiedStudent === true,
    };

    task.applicants.push({
      student: req.user.id,
      snapshot,
      status: "pending",
    });

    await task.save();

    await createNotification(
      task.employer,
      "A student applied to your internship"
    );

    res.json({ msg: "Applied successfully" });

  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({ msg: "Apply failed" });
  }
};

/* ================= UPDATE APPLICANT STATUS ================= */
export const updateApplicantStatus = async (req, res) => {
  try {
    const { taskId, studentId, status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status))
      return res.status(400).json({ msg: "Invalid status" });

    const task = await Task.findById(taskId);
    if (!task)
      return res.status(404).json({ msg: "Task not found" });

    if (task.employer.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    const applicant = task.applicants.find(
      a => a.student.toString() === studentId
    );

    if (!applicant)
      return res.status(404).json({ msg: "Applicant not found" });

    applicant.status = status;
    
    // Set acceptedAt date when employer accepts student
    if (status === "accepted") {
      applicant.acceptedAt = new Date();
    }

    if (status === "accepted") {
      task.status = "in_progress";
    }

    await task.save();

    await createNotification(
      studentId,
      `Your application was ${status}`
    );

    res.json({ msg: "Status updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update status" });
  }
};

/* ================= SUBMIT TASK ================= */
export const submitTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ msg: "Task not found" });

    if (task.status !== "in_progress")
      return res.status(400).json({ msg: "Task not active" });

    // Update submittedBy
    task.submittedBy = req.user.id;
    
    // Update applicant's status to submitted
    const applicant = task.applicants.find(
      a => a.student.toString() === req.user.id.toString()
    );
    if (applicant) {
      applicant.status = "submitted";
    }
    
    await task.save();

    // Notify employer about submission
    await createNotification(
      task.employer,
      `Student submitted work for ${task.title}`
    );

    res.json({ msg: "Work submitted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Submission failed" });
  }
};

/* ================= COMPLETE TASK ================= */
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || !task.submittedBy)
      return res.status(400).json({ msg: "No submission found" });

    task.status = "completed";
    task.completedBy = task.submittedBy;

    await task.save();

    // Create portfolio entry
    const portfolio = await Portfolio.create({
      student: task.completedBy,
      task: task._id,
      employer: task.employer,
      title: task.title,
      description: task.description,
    });

    // Update applicant's status to completed
    const applicant = task.applicants.find(
      a => a.student.toString() === task.completedBy.toString()
    );
    if (applicant) {
      applicant.status = "completed";
      await task.save();
    }

    // Notify student about task completion and portfolio creation
    await createNotification(
      task.completedBy,
      `Congratulations! Your task "${task.title}" has been completed. A new portfolio entry has been added to your profile!`
    );

    res.json({ msg: "Task completed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Completion failed" });
  }
};

/* ================= DELETE TASK ================= */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ msg: "Task not found" });

    if (task.employer.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    await task.deleteOne();
    res.json({ msg: "Task deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

/* ================= GET TASK BY ID ================= */

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid task id" });
    }

    const task = await Task.findById(id)
      .populate("employer", "name email")
      .populate("applicants.student", "name email");

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({ msg: "Failed to load internship" });
  }
};

/* ================= UPDATE TASK ================= */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task)
      return res.status(404).json({ msg: "Task not found" });

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
};

/* ================= PUBLIC TASKS ================= */
export const publicTasks = async (req, res) => {
  try {
    const now = new Date();
    
    // Show internships that are:
    // 1. Status is "open" (not started yet)
    // 2. Status is "in_progress" (already accepted someone, but still visible)
    // 3. NOT completed
    const tasks = await Task.find({
      status: { $ne: "completed" },
      $or: [
        { applyBy: { $gte: now } },  // Apply by date hasn't passed
        { applyBy: null },           // No deadline set
        { applyBy: "" }              // Empty deadline
      ]
    })
      .populate("employer", "name")
      .sort({ createdAt: -1 }); // Most recent first

    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load internships" });
  }
};

/* ================= GET ALL TASKS ================= */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("employer", "name email");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load tasks" });
  }
};
