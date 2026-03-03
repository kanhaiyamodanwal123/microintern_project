import User from "../models/User.js";

export const isEmployer = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== "employer") {
    return res.status(403).json({ msg: "Employer only" });
  }

  // Allow employers to use the platform
  next();
};

// Middleware to check if employer can post tasks
export const canPostTask = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== "employer") {
    return res.status(403).json({ msg: "Employer only" });
  }

  // Check if employer is verified by admin
  if (user.isVerifiedEmployer !== true) {
    return res.status(403).json({ 
      msg: "Your account is not verified. Please wait for admin approval to post tasks." 
    });
  }

  next();
};
