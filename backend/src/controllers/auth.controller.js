import User from "../models/User.js";
import Profile from "../models/Profile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


// ================= REGISTER =================

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      collegeName,
      role = "student",
      companyWebsite,
      companyName,
      companyDescription,
      companyAddress,
      companyPhone,
      degree,
      branch,
      year,
      graduationYear,
      interest,
    } = req.body;

    // check existing email
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "Email already registered" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // Handle file uploads for employer
    let companyRegistrationDoc = null;
    let companyLogo = null;

    if (req.files) {
      // Upload company registration document
      if (req.files.companyRegistrationDoc?.[0]) {
        const file = req.files.companyRegistrationDoc[0];
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "employer-docs",
          resource_type: "auto",
        });
        companyRegistrationDoc = uploadResult.secure_url;
      }

      // Upload company logo
      if (req.files.companyLogo?.[0]) {
        const file = req.files.companyLogo[0];
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "employer-logos",
          resource_type: "image",
        });
        companyLogo = uploadResult.secure_url;
      }
    }

    // Create user object
    const userData = {
      name,
      email,
      password: hashed,
      role,
      companyWebsite,
    };

    // Add employer-specific fields
    if (role === "employer") {
      userData.companyName = companyName;
      userData.companyDescription = companyDescription;
      userData.companyAddress = companyAddress;
      userData.companyPhone = companyPhone;
      userData.companyRegistrationDoc = companyRegistrationDoc;
      userData.companyLogo = companyLogo;
      // Employers need verification too
      userData.verificationStatus = "pending";
      userData.isVerifiedEmployer = false;
    }

    // create user
    const user = await User.create(userData);

    // ✅ auto create profile for student
    if (role === "student") {
      await Profile.create({
        student: user._id,
        name: user.name,
        collegeName,
        degree,
        branch,
        year,
        graduationYear,
        interest,
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Registration failed", error: error.message });
  }
};


// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ msg: "Wrong password" });

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Login failed" });
  }
};

// ================= GET ME =================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerifiedStudent: user.isVerifiedStudent,
      isVerifiedEmployer: user.isVerifiedEmployer,
      verificationStatus: user.verificationStatus,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch user" });
  }
};

// SEND RESET EMAIL
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Find user (NO verification check)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2️⃣ Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3️⃣ Update ONLY reset fields (no validation)
    await User.updateOne(
      { _id: user._id },
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: Date.now() + 15 * 60 * 1000,
      }
    );

    // 4️⃣ Send reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });
    console.log("RAW reset token:", resetToken);

    res.json({ msg: "Reset link sent to email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to send reset link" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // find user WITHOUT saving
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // hash password manually (no save hook)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // update ONLY required fields (no validation)
    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      }
    );

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Reset failed" });
  }
};
