import Notification from "../models/Notification.js";

export const createNotification = async (userId, message) => {
  await Notification.create({
    user: userId,
    message,
  });
};
