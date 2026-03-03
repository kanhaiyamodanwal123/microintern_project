import Message from "../models/Message.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// Get messages for a specific task
export const getMessages = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if user is authorized to view this chat
    const user = await User.findById(userId);
    
    let isAuthorized = false;
    
    if (user.role === "admin") {
      // Admin can view all chats
      isAuthorized = true;
    } else if (user.role === "employer") {
      // Employer can only view chats for their own tasks
      isAuthorized = task.employer.toString() === userId;
    } else if (user.role === "student") {
      // Student can only view chat if they're accepted for this task
      const acceptedApplicant = task.applicants.find(
        a => a.student.toString() === userId && 
        (a.status === "accepted" || a.status === "in_progress" || a.status === "submitted")
      );
      isAuthorized = !!acceptedApplicant;
    }

    if (!isAuthorized) {
      return res.status(403).json({ msg: "Not authorized to view this conversation" });
    }

    // Get messages
    const msgs = await Message.find({ task: taskId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load messages" });
  }
};

// Save a new message
export const saveMessage = async (req, res) => {
  const { taskId, text } = req.body;
  const userId = req.user.id;

  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if user is authorized to send messages
    const user = await User.findById(userId);
    
    let isAuthorized = false;
    
    if (user.role === "admin") {
      // Admin can send to all chats
      isAuthorized = true;
    } else if (user.role === "employer") {
      // Employer can only message for their own tasks
      isAuthorized = task.employer.toString() === userId;
    } else if (user.role === "student") {
      // Student can only message if they're accepted for this task
      const acceptedApplicant = task.applicants.find(
        a => a.student.toString() === userId && 
        (a.status === "accepted" || a.status === "in_progress" || a.status === "submitted")
      );
      isAuthorized = !!acceptedApplicant;
    }

    if (!isAuthorized) {
      return res.status(403).json({ msg: "Not authorized to send messages in this conversation" });
    }

    // Create the message
    const msg = await Message.create({
      task: taskId,
      sender: userId,
      text,
    });

    // Populate sender info before returning
    await msg.populate("sender", "name role");

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

// Get all conversations for current user
export const getMyConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    
    let tasks = [];
    
    if (user.role === "employer") {
      // Employer: get tasks where they have accepted students
      tasks = await Task.find({ 
        employer: userId,
        "applicants.status": { $in: ["accepted", "in_progress", "submitted"] }
      }).populate("employer", "name");
    } else if (user.role === "student") {
      // Student: get tasks where they are accepted
      tasks = await Task.find({
        "applicants.student": userId,
        "applicants.status": { $in: ["accepted", "in_progress", "submitted"] }
      }).populate("employer", "name");
    }

    // Get the latest message for each task
    const conversations = await Promise.all(
      tasks.map(async (task) => {
        const lastMessage = await Message.findOne({ task: task._id })
          .sort({ createdAt: -1 })
          .populate("sender", "name");
        
        const otherUser = user.role === "employer" 
          ? task.applicants.find(a => ["accepted", "in_progress", "submitted"].includes(a.status))?.student
          : task.employer;

        const otherUserDetails = otherUser 
          ? await User.findById(otherUser).select("name role")
          : null;

        return {
          taskId: task._id,
          taskTitle: task.title,
          otherUser: otherUserDetails,
          lastMessage: lastMessage ? {
            text: lastMessage.text,
            sender: lastMessage.sender?.name,
            createdAt: lastMessage.createdAt
          } : null,
          updatedAt: lastMessage?.createdAt || task.updatedAt
        };
      })
    );

    // Sort by most recent message
    conversations.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load conversations" });
  }
};
