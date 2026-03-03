import User from "../models/User.js";
import Task from "../models/Task.js";

// Get pending students
export const getPendingStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      verificationStatus: "pending",
    }).select("-password");

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load students" });
  }
};

// Get pending employers
export const getPendingEmployers = async (req, res) => {
  try {
    const employers = await User.find({
      role: "employer",
      verificationStatus: "pending",
    }).select("-password");

    res.json(employers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load employers" });
  }
};

// Get all users (students + employers)
export const getAllUsers = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    const employers = await User.find({ role: "employer" }).select("-password");

    res.json({ students, employers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load users" });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("employer", "name email companyName")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load tasks" });
  }
};

// Approve student
export const approveStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(400).json({ msg: "User is not a student" });
    }

    user.verificationStatus = "verified";
    user.isVerifiedStudent = true;
    await user.save();

    res.json({ msg: "Student approved", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Approval failed" });
  }
};

// Reject student
export const rejectStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.verificationStatus = "rejected";
    user.isVerifiedStudent = false;
    await user.save();

    res.json({ msg: "Student rejected", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Rejection failed" });
  }
};

// Approve employer
export const approveEmployer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "employer") {
      return res.status(400).json({ msg: "User is not an employer" });
    }

    user.verificationStatus = "verified";
    user.isVerifiedEmployer = true;
    await user.save();

    res.json({ msg: "Employer approved", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Approval failed" });
  }
};

// Reject employer
export const rejectEmployer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.verificationStatus = "rejected";
    user.isVerifiedEmployer = false;
    await user.save();

    res.json({ msg: "Employer rejected", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Rejection failed" });
  }
};

// Delete any user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If deleting an employer, also delete their tasks
    if (user.role === "employer") {
      await Task.deleteMany({ employer: user._id });
    }

    await user.deleteOne();
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

// Delete any task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await task.deleteOne();
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

// Get admin dashboard stats
export const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const verifiedStudents = await User.countDocuments({ 
      role: "student", 
      isVerifiedStudent: true 
    });
    const pendingStudents = await User.countDocuments({ 
      role: "student", 
      verificationStatus: "pending" 
    });

    const totalEmployers = await User.countDocuments({ role: "employer" });
    const verifiedEmployers = await User.countDocuments({ 
      role: "employer", 
      isVerifiedEmployer: true 
    });
    const pendingEmployers = await User.countDocuments({ 
      role: "employer", 
      verificationStatus: "pending" 
    });

    const totalTasks = await Task.countDocuments();
    const openTasks = await Task.countDocuments({ status: "open" });
    const inProgressTasks = await Task.countDocuments({ status: "in_progress" });
    const completedTasks = await Task.countDocuments({ status: "completed" });

    res.json({
      students: {
        total: totalStudents,
        verified: verifiedStudents,
        pending: pendingStudents,
      },
      employers: {
        total: totalEmployers,
        verified: verifiedEmployers,
        pending: pendingEmployers,
      },
      tasks: {
        total: totalTasks,
        open: openTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load stats" });
  }
};
