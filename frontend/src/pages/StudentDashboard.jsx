import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  if (!user || user.role !== "student") {
    return <p className="p-10 text-center">Access denied</p>;
  }

  const uploadPhoto = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await api.put("/api/profile/photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile photo updated!");
      loadProfile();
    } catch (err) {
      alert("Photo upload failed");
    }
  };

  /* ---------------- LOAD DATA ---------------- */
  const loadTasks = async () => {
    try {
      const res = await api.get("/api/tasks/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const submit = async (id) => {
    try {
      await api.post(`/api/tasks/submit/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Work submitted successfully!");
      loadTasks();
    } catch (err) {
      alert("Submission failed: " + (err.response?.data?.msg || "Unknown error"));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadTasks(), loadProfile()]);
      setLoading(false);
    };
    loadData();
  }, []);

  /* ---------------- COUNTS ---------------- */
  const total = tasks.length;
  const accepted = tasks.filter(t =>
    t.applicants?.some(a => a.status === "accepted")
  ).length;
  const pending = tasks.filter(t =>
    t.applicants?.some(a => a.status === "pending")
  ).length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  /* ---------------- CALCULATE PROFILE COMPLETENESS ---------------- */
  const calculateCompleteness = () => {
    if (!profile) return 0;
    let score = 0;
    const fields = [
      profile.name, profile.age, profile.phone, profile.address,
      profile.collegeName, profile.collegeEmail, profile.degree,
      profile.branch, profile.year, profile.graduationYear,
      profile.skills?.length > 0, profile.bio,
      profile.github, profile.linkedin, profile.project,
      profile.photo, profile.resume
    ];
    fields.forEach(f => { if (f) score++; });
    return Math.round((score / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>

        <button
          onClick={() => {
            logout();
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{total}</p>
          <p className="text-sm text-gray-500">Total Applications</p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{inProgress}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-purple-600">{completed}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="relative">
              {profile?.photo ? (
                <img src={profile.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer text-xs">
                📷
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadPhoto(e.target.files[0])} />
              </label>
            </div>
            
            {/* Profile Info */}
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{profile?.collegeName || "No college added"}</p>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Profile Completeness</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${completeness < 50 ? 'bg-red-500' : completeness < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{completeness}%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/internships")}
            className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg text-sm"
          >
            Browse Internships
          </button>
          <button
            onClick={() => navigate("/saved")}
            className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg text-sm"
          >
            Saved
          </button>
          {profile?.verified && (
            <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm">
              ✅ Verified Student
            </span>
          )}
        </div>
      </div>

      {/* APPLICATIONS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Applications</h3>

        {!tasks.length && (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            <p className="text-lg mb-2">You haven't applied to any internships yet.</p>
            <button
              onClick={() => navigate("/internships")}
              className="text-blue-600 hover:underline"
            >
              Browse available internships →
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {tasks.map(task => {
            const app = task.applicants?.find(
              a =>
                a.student?.toString?.() === user.id ||
                a.student?._id === user.id
            );

            return (
              <div
                key={task._id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      {task.employer?.name}
                    </p>
                  </div>

                  <StatusBadge status={app?.status || task.status} />
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>💰 ₹{task.stipend?.toLocaleString()}</span>
                  <span>📍 {task.locations?.join(", ") || "Remote"}</span>
                </div>

                {task.status === "in_progress" &&
                  app?.status === "accepted" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => submit(task._id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Submit Work
                      </button>
                      <button
                        onClick={() => navigate(`/chat/${task._id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        💬 Chat
                      </button>
                    </div>
                  )}
                
                {task.status === "completed" && (
                  <button
                    onClick={() => navigate("/portfolio")}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm w-full"
                  >
                    View Portfolio Entry
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatusBadge({ status }) {
  if (!status) return null;

  const styles = {
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
    submitted: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    open: "bg-gray-100 text-gray-700",
  };

  const labels = {
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
    submitted: "Submitted",
    in_progress: "In Progress",
    completed: "Completed",
    open: "Open",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
