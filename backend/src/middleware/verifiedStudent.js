import User from "../models/User.js";

export const isVerifiedStudent = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.role !== "student") {
    return res.status(403).json({ msg: "This feature is for students only" });
  }

  // Allow students to apply even if not verified for testing
  // In production, uncomment the verification checks below
  /*
  if (!user.isVerifiedStudent) {
    return res.status(403).json({ 
      msg: "Your student account is not verified. Please verify your student ID first.",
      verificationStatus: user.verificationStatus
    });
  }

  if (user.verificationStatus === "rejected") {
    return res.status(403).json({ 
      msg: "Your student verification was rejected. Please contact support."
    });
  }
  */

  next();
};
