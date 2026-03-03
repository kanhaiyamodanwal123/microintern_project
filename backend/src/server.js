import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES module helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ LOAD ENV FIRST (ABSOLUTELY FIRST)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 🔍 DEBUG (REMOVE LATER)


// ✅ NOW import app AFTER env is loaded
const { default: app } = await import("./app.js");

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Track connected users by their user ID
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user ID when they connect
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("joinTask", (taskId) => {
    socket.join(taskId);
    console.log(`Socket ${socket.id} joined task ${taskId}`);
  });
  
  // Video call signaling - use user ID to find socket
  socket.on("callUser", (data) => {
    const targetSocketId = connectedUsers.get(data.userToCall);
    if (targetSocketId) {
      io.to(targetSocketId).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        taskId: data.taskId,
      });
      console.log(`Call initiated from ${data.from} to ${data.userToCall}`);
    } else {
      console.log(`User ${data.userToCall} not found online`);
    }
  });

  socket.on("answerCall", (data) => {
    const targetSocketId = connectedUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("callAccepted", data.signal);
    }
  });

  socket.on("callEnded", () => {
    io.emit("callEnded");
  });
  
  socket.on("sendMessage", async (data) => {
    try {
      const Message = (await import("./models/Message.js")).default;
      const message = await Message.findById(data.messageId)
        .populate("sender", "name role")
        .populate("task", "title");
      
      if (message) {
        io.to(data.taskId).emit("newMessage", message);
      }
    } catch (err) {
      io.to(data.taskId).emit("newMessage", {
        ...data,
        createdAt: new Date(),
        sender: { name: "User", role: "unknown" }
      });
    }
  });

  socket.on("disconnect", () => {
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
