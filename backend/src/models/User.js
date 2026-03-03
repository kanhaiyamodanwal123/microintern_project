import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
resetPasswordExpire: Date,

    role: {
      type: String,
      enum: ["student", "employer", "admin"],
      default: "student",
    },

    // verification system
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    isVerifiedStudent: {
      type: Boolean,
      default: false,
    },

    isVerifiedEmployer: {
      type: Boolean,
      default: false,
    },

    studentIdImage: { type: String },

    // Employer verification fields
    companyName: { type: String, trim: true },
    companyRegistrationDoc: { type: String }, // URL to company registration document
    companyLogo: { type: String },
    companyDescription: { type: String },
    companyAddress: { type: String },
    companyPhone: { type: String },
    companyWebsite: { type: String, trim: true },

    averageRating: {
      type: Number,
      default: 0,
    },

    // Admin notes
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
