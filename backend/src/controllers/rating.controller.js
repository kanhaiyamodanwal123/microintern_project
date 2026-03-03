import Rating from "../models/Rating.js";
import User from "../models/User.js";

export const submitRating = async (req, res) => {
  const { taskId, targetId, score, comment } = req.body;

  await Rating.create({
    task: taskId,
    reviewer: req.user.id,
    target: targetId,
    score,
    comment,
  });

  // recalc average rating
  const ratings = await Rating.find({ target: targetId });

  const avg =
    ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

  await User.findByIdAndUpdate(targetId, {
    averageRating: avg,
  });

  res.json({ msg: "Rating submitted" });
};
