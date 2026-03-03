import { useEffect, useState } from "react";
import api from "../api/api";

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await api.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = notes.filter(n => !n.read).length;

  const getIcon = (message) => {
    if (!message) return "🔔";
    if (message.includes("applied")) return "📝";
    if (message.includes("accepted")) return "✅";
    if (message.includes("rejected")) return "❌";
    if (message.includes("submitted")) return "📤";
    if (message.includes("completed")) return "🎉";
    if (message.includes("verification")) return "🆔";
    return "🔔";
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-500">Stay updated on your applications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          {unreadCount} new
        </span>
      )}

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="bg-white border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-gray-700">No Notifications</h3>
          <p className="text-gray-500 mt-2">
            You'll see updates about your applications here.
          </p>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notes.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && markAsRead(n._id)}
            className={`bg-white border rounded-xl p-4 transition cursor-pointer hover:shadow-sm ${
              n.read ? "opacity-60" : "border-l-4 border-l-blue-500"
            }`}
          >
            <div className="flex gap-4">
              <div className="text-2xl">{getIcon(n.message)}</div>
              <div className="flex-1">
                <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-800 font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : "Recently"}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
