import Portfolio from "../models/Portfolio.js";

export const getPortfolio = async (req, res) => {
  const items = await Portfolio.find({ student: req.user.id })
    .populate("employer", "name");

  res.json(items);
};
