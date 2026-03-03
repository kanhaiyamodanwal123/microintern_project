import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("overview");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const token = localStorage.getItem("token");

  if (!user || user.role !== "employer") {
    return <p className="p-10 text-center">Access denied - Employer only</p>;
  }

  const load = async () => {
    try {
      const res = await api.get("/api/tasks/employer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (taskId, studentId, status) => {
    try {
      await api.post(
        "/api/tasks/status",
        { taskId, studentId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Applicant ${status} successfully!`);
      load();
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.msg || "Unknown error"));
    }
  };

  const completeTask = async (taskId) => {
    try {
      await api.post(
        `/api/tasks/complete/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task completed! Portfolio entry created for student.");
      load();
    } catch (err) {
      alert("Failed to complete task: " + (err.response?.data?.msg || "Unknown error"));
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task deleted successfully!");
      load();
    } catch (err) {
      alert("Failed to delete task: " + (err.response?.data?.msg || "Unknown error"));
    }
  };

  // Stats
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === "in_progress").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const openTasks = tasks.filter(t => t.status === "open").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

function InteractiveTaskCard({ task, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border rounded-xl p-6 transition hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">
            {open ? task.description : task.description?.slice(0, 100) + "..."}
          </p>

          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>💰 ₹{task.stipend}</span>
            <span>👥 {task.applicants?.length || 0} applicants</span>
          </div>
        </div>

        <TaskStatusBadge status={task.status} />
      </div>

      {/* Expand */}
      <button
        onClick={() => setOpen(!open)}
        className="text-blue-600 text-sm mt-3 hover:underline"
      >
        {open ? "Hide details ↑" : "View details ↓"}
      </button>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          ✏️ Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

  function InteractiveStatCard({ title, value, onClick, color }) {
  const colors = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-700",
    green: "bg-green-50 hover:bg-green-100 text-green-700",
    yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700",
    purple: "bg-purple-50 hover:bg-purple-100 text-purple-700",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition transform hover:-translate-y-1 hover:shadow-md ${colors[color]}`}
    >
      <p className="text-3xl font-bold">{value || 0}</p>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs opacity-70 mt-1">Click to view →</p>
    </button>
  );
}

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employer Dashboard</h2>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/create-task")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create Task
          </button>

          <button
            onClick={() => {
              logout();
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {["overview", "tasks", "applicants"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-medium ${
              tab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
     {/* OVERVIEW */}
{tab === "overview" && (
  <div className="space-y-6">
    {/* Stat Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <InteractiveStatCard
        title="Total Tasks"
        value={totalTasks}
        onClick={() => setTab("tasks")}
        color="blue"
      />
      <InteractiveStatCard
        title="Open"
        value={openTasks}
        onClick={() => setTab("tasks")}
        filter="open"
        color="green"
      />
      <InteractiveStatCard
        title="Active"
        value={activeTasks}
        onClick={() => setTab("tasks")}
        filter="in_progress"
        color="yellow"
      />
      <InteractiveStatCard
        title="Completed"
        value={completedTasks}
        onClick={() => setTab("tasks")}
        filter="completed"
        color="purple"
      />
    </div>

    {/* Insight bar */}
    <div className="bg-white border rounded-xl p-5">
      <p className="font-medium mb-2">📊 Task Completion Rate</p>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-600 h-3 transition-all"
          style={{
            width: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%`,
          }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </div>
  </div>
)}

      {/* TASKS */}
     {/* TASKS */}
{tab === "tasks" && (
  <div className="space-y-4">
    
    {/* Search + Filters */}
    <div className="flex flex-wrap gap-3 items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="border rounded-lg px-4 py-2 w-full md:w-64"
      />

      {["all", "open", "in_progress", "completed"].map(s => (
        <button
          key={s}
          onClick={() => setStatusFilter(s)}
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            statusFilter === s
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {s.replace("_", " ").toUpperCase()}
        </button>
      ))}
    </div>

    {/* Task List */}
    {tasks
      .filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "all" || t.status === statusFilter)
      )
      .map(task => (
        <InteractiveTaskCard
          key={task._id}
          task={task}
          onEdit={() => setEditingTask(task)}
          onDelete={() => deleteTask(task._id)}
        />
      ))}

    {!tasks.length && (
      <div className="text-center text-gray-500 p-10">
        No tasks found.
      </div>
    )}
  </div>
)}
      {/* APPLICANTS */}
      {tab === "applicants" && (
        <div className="space-y-4">
          {tasks.every(t => !t.applicants?.length) && (
            <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
              No applicants yet.
            </div>
          )}

          {tasks.map(task => 
            task.applicants?.map((app, idx) => (
              <div key={`${task._id}-${idx}`} className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.employer?.name}</p>
                  </div>
                  <ApplicantStatusBadge status={app.status} />
                </div>

                {/* Applicant Full Info Card */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  {/* Header with Photo and Name */}
                  <div className="flex items-start gap-4">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      {app.snapshot?.photo ? (
                        <img 
                          src={app.snapshot.photo} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                          {app.snapshot?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    
                    {/* Basic Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-900">{app.snapshot?.name || "Unknown"}</h4>
                      
                      {/* Verified Badge */}
                      {app.snapshot?.verified && (
                        <span className="inline-flex items-center mt-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          ✅ Verified Student
                        </span>
                      )}
                      
                      {/* Contact Info Row */}
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        {app.snapshot?.phone && (
                          <span className="flex items-center gap-1">
                            📞 {app.snapshot.phone}
                          </span>
                        )}
                        {app.snapshot?.email && (
                          <span className="flex items-center gap-1">
                            ✉️ {app.snapshot.email}
                          </span>
                        )}
                      </div>
                      
                      {/* Address */}
                      {app.snapshot?.address && (
                        <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                          📍 {app.snapshot.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* College Info */}
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-sm font-medium text-gray-700">
                      🏫 {app.snapshot?.collegeName || "No college specified"}
                    </p>
                  </div>

                  {/* Bio */}
                  {app.snapshot?.bio && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">About</p>
                      <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border">
                        {app.snapshot.bio}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {app.snapshot?.skills?.map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                      {!app.snapshot?.skills?.length && (
                        <span className="text-sm text-gray-400">No skills specified</span>
                      )}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    {app.snapshot?.github && (
                      <a 
                        href={app.snapshot.github} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {app.snapshot?.linkedin && (
                      <a 
                        href={app.snapshot.linkedin} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {app.snapshot?.project && (
                      <a 
                        href={app.snapshot.project} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-500 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Live Project
                      </a>
                    )}
                  </div>

                  {/* Resume */}
                  {app.snapshot?.resume && (
                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Resume</p>
                        <a href={app.snapshot.resume} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                          View Resume →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {app.status === "pending" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => update(task._id, app.student._id || app.student, "accepted")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
                    >
                      ✓ Accept Applicant
                    </button>
                    <button
                      onClick={() => update(task._id, app.student._id || app.student, "rejected")}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium transition"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                {task.status === "in_progress" && app.status === "accepted" && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <button
                      onClick={() => completeTask(task._id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
                    >
                      ✓ Mark as Completed
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${task._id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
                    >
                      💬 Chat with Student
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {editingTask && (
        <EditModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          onSaved={load} 
        />
      )}

    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };
  
  return (
    <div className={`rounded-xl border p-4 ${colors[color] || colors.blue}`}>
      <p className="text-3xl font-bold">{value || 0}</p>
      <p className="text-sm">{title}</p>
    </div>
  );
}

function TaskStatusBadge({ status }) {
  const styles = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-purple-100 text-purple-700",
  };
  
  const labels = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}

function ApplicantStatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    submitted: "bg-blue-100 text-blue-700",
    completed: "bg-purple-100 text-purple-700",
  };
  
  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    submitted: "Submitted",
    completed: "Completed",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}

function EditModal({ task, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    skills: task.skills?.join(", ") || "",
    stipend: task.stipend || "",
    locations: task.locations?.join(", ") || "",
    experience: task.experience || "0 years",
    startDate: task.startDate || "Immediately",
    applyBy: task.applyBy || "",
    responsibilities: task.responsibilities?.join("\n") || "",
    eligibility: task.eligibility?.join("\n") || "",
    perks: task.perks?.join("\n") || "",
  });
  
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/api/tasks/${task._id}`, {
        title: form.title,
        description: form.description,
        skills: form.skills.split(",").map(s => s.trim()),
        stipend: Number(form.stipend),
        locations: form.locations.split(",").map(l => l.trim()),
        experience: form.experience,
        startDate: form.startDate,
        applyBy: form.applyBy,
        responsibilities: form.responsibilities ? form.responsibilities.split("\n") : [],
        eligibility: form.eligibility ? form.eligibility.split("\n") : [],
        perks: form.perks ? form.perks.split("\n") : [],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSaved();
      onClose();
    } catch (err) {
      alert("Failed to update: " + (err.response?.data?.msg || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Edit Task</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated) *</label>
            <input 
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" 
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locations *</label>
              <input 
                value={form.locations}
                onChange={e => setForm({ ...form, locations: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Delhi, Bangalore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (₹) *</label>
              <input 
                type="number"
                value={form.stipend}
                onChange={e => setForm({ ...form, stipend: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input 
                value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="0 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Immediately"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apply By *</label>
            <input 
              type="date"
              value={form.applyBy}
              onChange={e => setForm({ ...form, applyBy: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
            <textarea 
              value={form.responsibilities}
              onChange={e => setForm({ ...form, responsibilities: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="What will the student do?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility (one per line)</label>
            <textarea 
              value={form.eligibility}
              onChange={e => setForm({ ...form, eligibility: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Who can apply?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perks & Benefits (one per line)</label>
            <textarea 
              value={form.perks}
              onChange={e => setForm({ ...form, perks: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Certificate, Flexible hours, etc."
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 mt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
