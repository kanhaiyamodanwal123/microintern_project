import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import taskRoutes from "./routes/task.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import messageRoutes from "./routes/message.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import profileRoutes from "./routes/profile.routes.js";

         // ✅ must be first
connectDB();

const app = express();

app.use(cors({
  origin: "https://microintern-frontend.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔥 REQUIRED
app.use(morgan("dev"));

app.use("/api/verification", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/profile", profileRoutes);
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

export default app;
