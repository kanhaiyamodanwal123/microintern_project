import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    text: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
