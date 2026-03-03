import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    // 👤 Basic info
    name: { type: String, trim: true },
    age: { type: Number, min: 10, max: 100 },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },

    // 🎓 Education
    collegeName: { type: String, trim: true },
    degree: { type: String, trim: true },       // ✅ ADD
    branch: { type: String, trim: true },       // ✅ ADD
    year: { type: String, trim: true },         // ✅ ADD
    graduationYear: { type: Number },           // ✅ ADD
    interest: { type: String, trim: true },     // ✅ ADD

    collegeEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },

    // 💼 Skills
    skills: {
      type: [String],
      default: [],
    },

    // 🔗 Links
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    project: { type: String, trim: true },

    // 📂 Uploads
    photo: { type: String },
    collegeIdCard: { type: String },
    resume: { type: String },

    // ✅ Admin verification
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
