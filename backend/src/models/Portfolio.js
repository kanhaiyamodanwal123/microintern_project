import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
