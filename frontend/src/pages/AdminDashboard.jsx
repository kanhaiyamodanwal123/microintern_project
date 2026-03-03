import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">Access Denied - Admin Only</p>
      </div>
    );
  }

  const loadStats = async () => {
    try {
      const res = await api.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const loadPendingStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/pending/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
    setLoading(false);
  };

  const loadPendingEmployers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/pending/employers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployers(res.data);
    } catch (err) {
      console.error("Failed to load employers:", err);
    }
    setLoading(false);
  };

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students || []);
      setEmployers(res.data.employers || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
    setLoading(false);
  };

  const loadAllTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
    setLoading(false);
  };

  const approveStudent = async (id) => {
    try {
      await api.post(`/api/admin/student/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student approved successfully!");
      loadPendingStudents();
      loadStats();
    } catch (err) {
      alert("Failed to approve student");
    }
  };

  const rejectStudent = async (id) => {
    try {
      await api.post(`/api/admin/student/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student rejected!");
      loadPendingStudents();
      loadStats();
    } catch (err) {
      alert("Failed to reject student");
    }
  };

  const approveEmployer = async (id) => {
    try {
      await api.post(`/api/admin/employer/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Employer approved successfully!");
      loadPendingEmployers();
      loadStats();
    } catch (err) {
      alert("Failed to approve employer");
    }
  };

  const rejectEmployer = async (id) => {
    try {
      await api.post(`/api/admin/employer/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Employer rejected!");
      loadPendingEmployers();
      loadStats();
    } catch (err) {
      alert("Failed to reject employer");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete all their tasks.")) return;
    try {
      await api.delete(`/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      loadAllUsers();
      loadStats();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/admin/task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task deleted successfully!");
      loadAllTasks();
      loadStats();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (tab === "pending-students") loadPendingStudents();
    if (tab === "pending-employers") loadPendingEmployers();
    if (tab === "all-users") loadAllUsers();
    if (tab === "all-tasks") loadAllTasks();
  }, [tab]);

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "pending-students", label: "⏳ Pending Students" },
    { id: "pending-employers", label: "⏳ Pending Employers" },
    { id: "all-users", label: "👥 All Users" },
    { id: "all-tasks", label: "📋 All Tasks" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🛡️ Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
            >
              🌐 View Site
            </button>
            <button
              onClick={() => {
                logout();
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg text-sm text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  tab === t.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.label}
                {t.id === "pending-students" && stats?.students?.pending > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {stats.students.pending}
                  </span>
                )}
                {t.id === "pending-employers" && stats?.employers?.pending > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {stats.employers.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {tab === "overview" && stats && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Platform Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Students" value={stats.students.total} color="blue" />
              <StatCard title="Verified Students" value={stats.students.verified} color="green" />
              <StatCard title="Total Employers" value={stats.employers.total} color="purple" />
              <StatCard title="Verified Employers" value={stats.employers.verified} color="green" />
              <StatCard title="Total Tasks" value={stats.tasks.total} color="gray" />
              <StatCard title="Open Tasks" value={stats.tasks.open} color="yellow" />
              <StatCard title="In Progress" value={stats.tasks.inProgress} color="blue" />
              <StatCard title="Completed" value={stats.tasks.completed} color="green" />
            </div>
            
            {/* Pending Actions */}
            {(stats.students.pending > 0 || stats.employers.pending > 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Pending Actions</h3>
                <div className="flex gap-4">
                  {stats.students.pending > 0 && (
                    <button
                      onClick={() => setTab("pending-students")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      {stats.students.pending} Students to Verify
                    </button>
                  )}
                  {stats.employers.pending > 0 && (
                    <button
                      onClick={() => setTab("pending-employers")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      {stats.employers.pending} Employers to Verify
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pending Students Tab */}
        {tab === "pending-students" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Student Verifications</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : students.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-green-700 text-lg">✅ No pending student verifications</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {students.map((student) => (
                  <StudentCard
                    key={student._id}
                    student={student}
                    onApprove={approveStudent}
                    onReject={rejectStudent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Employers Tab */}
        {tab === "pending-employers" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Employer Verifications</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : employers.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-green-700 text-lg">✅ No pending employer verifications</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {employers.map((employer) => (
                  <EmployerCard
                    key={employer._id}
                    employer={employer}
                    onApprove={approveEmployer}
                    onReject={rejectEmployer}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Users Tab */}
        {tab === "all-users" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Users</h2>
            
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Students ({students.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Verified</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{s.name}</td>
                        <td className="px-4 py-3 text-gray-600">{s.email}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={s.verificationStatus} />
                        </td>
                        <td className="px-4 py-3">
                          {s.isVerifiedStudent ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteUser(s._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Employers ({employers.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Website</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Verified</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employers.map((e) => (
                      <tr key={e._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{e.name}</td>
                        <td className="px-4 py-3">{e.companyName || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{e.email}</td>
                        <td className="px-4 py-3 text-blue-600">
                          {e.companyWebsite ? (
                            <a href={e.companyWebsite} target="_blank" rel="noreferrer" className="hover:underline">
                              View
                            </a>
                          ) : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={e.verificationStatus} />
                        </td>
                        <td className="px-4 py-3">
                          {e.isVerifiedEmployer ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteUser(e._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All Tasks Tab */}
        {tab === "all-tasks" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Tasks</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : tasks.length === 0 ? (
              <div className="bg-gray-50 border rounded-xl p-8 text-center">
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div key={task._id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-gray-600 text-sm">{task.description?.slice(0, 100)}...</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>🏢 {task.employer?.name}</span>
                          <span>💰 ₹{task.stipend}</span>
                          <span>📍 {task.locations?.join(", ") || "Remote"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TaskStatusBadge status={task.status} />
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Applicants: {task.applicants?.length || 0} | Posted: {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };
  
  return (
    <div className={`rounded-xl border p-4 ${colors[color] || colors.gray}`}>
      <p className="text-3xl font-bold">{value || 0}</p>
      <p className="text-sm opacity-80">{title}</p>
    </div>
  );
}

function StudentCard({ student, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex flex-wrap gap-6">
        {/* Student Info */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-semibold text-lg">{student.name}</h3>
          <p className="text-gray-600">{student.email}</p>
          <p className="text-sm text-gray-500">Student ID: {student._id.slice(-8)}</p>
        </div>

        {/* ID Image */}
        <div>
          <p className="text-sm font-medium mb-2">Student ID Document</p>
          {student.studentIdImage ? (
            <img
              src={student.studentIdImage}
              alt="Student ID"
              className="w-32 h-24 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-32 h-24 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onApprove(student._id)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ✅ Approve
          </button>
          <button
            onClick={() => onReject(student._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployerCard({ employer, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex flex-wrap gap-6">
        {/* Employer Info */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-semibold text-lg">{employer.name}</h3>
          <p className="text-gray-600">{employer.email}</p>
          <p className="text-sm text-gray-500">Employer ID: {employer._id.slice(-8)}</p>
          
          <div className="mt-3 space-y-1">
            <p className="text-sm"><span className="font-medium">Company:</span> {employer.companyName || "N/A"}</p>
            <p className="text-sm"><span className="font-medium">Website:</span> {employer.companyWebsite || "N/A"}</p>
            {employer.companyDescription && (
              <p className="text-sm text-gray-600">{employer.companyDescription.slice(0, 100)}...</p>
            )}
          </div>
        </div>

        {/* Company Documents */}
        {/* Company Documents */}
<div>
  <p className="text-sm font-medium mb-2">Company Registration Document</p>

  {employer.companyRegistrationDoc ? (
    employer.companyRegistrationDoc.endsWith(".pdf") ? (
      <a
        href={employer.companyRegistrationDoc}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        📄 View Company Document
      </a>
    ) : (
      <img
        src={employer.companyRegistrationDoc}
        alt="Company Doc"
        className="w-32 h-24 object-cover rounded-lg border"
      />
    )
  ) : (
    <div className="w-32 h-24 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-sm">
      No Doc
    </div>
  )}
</div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onApprove(employer._id)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ✅ Approve
          </button>
          <button
            onClick={() => onReject(employer._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    verified: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function TaskStatusBadge({ status }) {
  const styles = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-purple-100 text-purple-700",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
