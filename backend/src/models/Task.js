import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    /* ===== BASIC ===== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    stipend: {
      type: Number,
      default: 0,
    },

    deadline: Date,

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ===== DETAILS PAGE FIELDS ===== */
    locations: {
      type: [String],               // ["Delhi", "Hyderabad"]
      default: [],
    },

    employmentType: {
      type: String,
      enum: ["Internship", "Fresher", "Full-time"],
      default: "Internship",
    },

    experience: {
      type: String,                 // "0 year(s)", "1-2 years"
      default: "0 year(s)",
    },

    startDate: {
      type: String,
      default: "Immediately",
    },

    applyBy: Date,

    responsibilities: {
      type: [String],
      default: [],
    },

    eligibility: {
      type: [String],
      default: [],
    },

    perks: {
      type: [String],
      default: [],
    },

    /* ===== APPLICATIONS ===== */
    applicants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        status: {
          type: String,
          enum: ["pending", "accepted", "rejected", "submitted", "completed"],
          default: "pending",
        },

        // Track when student was accepted
        acceptedAt: {
          type: Date,
        },

        snapshot: {
          name: String,
          age: Number,
          phone: String,
          address: String,

          collegeName: String,
          collegeEmail: String,

          skills: [String],
          bio: String,

          github: String,
          linkedin: String,
          project: String,

          resume: String,
          photo: String,

          verified: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],

    /* ===== TASK STATUS ===== */
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },

    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
