import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import useAuth from "../context/useAuth";

export default function Conversations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await api.get("/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="text-blue-100 text-sm">
              {user?.role === "employer" 
                ? "Your conversations with accepted students" 
                : "Your conversations with employers"}
            </p>
          </div>

          {/* Conversations List */}
          <div className="divide-y">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-lg">No active conversations yet</p>
                <p className="text-sm mt-2">
                  {user?.role === "employer"
                    ? "Accept a student application to start chatting"
                    : "Get accepted to an internship to start chatting with your employer"}
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.taskId}
                  onClick={() => navigate(`/chat/${conv.taskId}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {conv.otherUser?.name?.[0]?.toUpperCase() || "?"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.taskTitle}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conv.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.otherUser?.role === "employer" 
                        ? `Employer: ${conv.otherUser?.name}`
                        : `Student: ${conv.otherUser?.name}`}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        <span className="font-medium">
                          {conv.lastMessage.sender}:
                        </span>{" "}
                        {conv.lastMessage.text}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400">›</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

