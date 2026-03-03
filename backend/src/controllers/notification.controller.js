import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notes = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(notes);
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to mark as read" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to mark all as read" });
  }
};
