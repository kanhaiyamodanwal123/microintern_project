import User from "../models/User.js";

// Middleware to ensure user is a student (not employer or admin)
export const isStudent = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.role !== "student") {
    return res.status(403).json({ msg: "Only students can apply to internships" });
  }

  next();
};
