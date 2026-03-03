import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const t = res.data;
      setForm({
        title: t.title || "",
        description: t.description || "",
        skills: t.skills?.join(", ") || "",
        stipend: t.stipend || "",
        locations: t.locations?.join(", ") || "",
        experience: t.experience || "0 years",
        startDate: t.startDate || "Immediately",
        applyBy: t.applyBy || "",
        responsibilities: t.responsibilities?.join("\n") || "",
        eligibility: t.eligibility?.join("\n") || "",
        perks: t.perks?.join("\n") || "",
      });
      setLoading(false);
    }).catch(err => {
      console.error("Error loading task:", err);
      setLoading(false);
    });
  }, [id]);

  const validate = () => {
    if (
      !form.title ||
      !form.description ||
      !form.skills ||
      !form.stipend ||
      !form.locations ||
      !form.applyBy
    ) {
      setError("Please fill all required fields");
      return false;
    }
    return true;
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      await api.put(
        `/api/tasks/${id}`,
        {
          title: form.title,
          description: form.description,
          stipend: Number(form.stipend),
          skills: form.skills.split(",").map(s => s.trim()),
          locations: form.locations.split(",").map(l => l.trim()),
          experience: form.experience,
          startDate: form.startDate,
          applyBy: form.applyBy,
          responsibilities: form.responsibilities ? form.responsibilities.split("\n") : [],
          eligibility: form.eligibility ? form.eligibility.split("\n") : [],
          perks: form.perks ? form.perks.split("\n") : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Task updated successfully!");
      setTimeout(() => navigate("/employer-dashboard"), 1200);

    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err);
      setError(err.response?.data?.msg || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!form) return <p className="p-10 text-center">Task not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Internship
          </h2>
          <p className="text-gray-500">
            Update your internship opportunity details
          </p>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}
        {success && <p className="text-green-600 text-sm bg-green-50 p-3 rounded">{success}</p>}

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internship Title *
            </label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="e.g., React Developer Intern"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="input h-28"
              placeholder="Describe the internship role and what the student will learn..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills Required *
            </label>
            <input
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              className="input"
              placeholder="React, Node.js, MongoDB (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locations *
            </label>
            <input
              value={form.locations}
              onChange={e => setForm({ ...form, locations: e.target.value })}
              className="input"
              placeholder="Delhi, Bangalore, Remote (comma separated)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Required
              </label>
              <input
                value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })}
                className="input"
                placeholder="0 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stipend (₹) *
              </label>
              <input
                type="number"
                value={form.stipend}
                onChange={e => setForm({ ...form, stipend: e.target.value })}
                className="input"
                placeholder="5000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="input"
                placeholder="Immediately"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply By *
              </label>
              <input
                type="date"
                value={form.applyBy}
                onChange={e => setForm({ ...form, applyBy: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsibilities (one per line)
            </label>
            <textarea
              value={form.responsibilities}
              onChange={e => setForm({ ...form, responsibilities: e.target.value })}
              className="input h-28"
              placeholder="What will the student do?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eligibility Criteria (one per line)
            </label>
            <textarea
              value={form.eligibility}
              onChange={e => setForm({ ...form, eligibility: e.target.value })}
              className="input h-28"
              placeholder="Who can apply?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Perks & Benefits (one per line)
            </label>
            <textarea
              value={form.perks}
              onChange={e => setForm({ ...form, perks: e.target.value })}
              className="input h-28"
              placeholder="Certificate, Flexible hours, etc."
            />
          </div>

        </div>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => navigate("/employer-dashboard")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Tailwind reusable input style */}
      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            outline: none;
          }
          .input:focus {
            ring: 2px solid #2563eb;
          }
        `}
      </style>
    </div>
  );
}

