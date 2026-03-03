import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    score: {
      type: Number,
      min: 1,
      max: 5,
    },

    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
