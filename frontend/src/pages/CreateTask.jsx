import { useState, useEffect } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    stipend: "",
    locations: "",
    experience: "0 years",
    startDate: "Immediately",
    applyBy: "",
    responsibilities: "",
    eligibility: "",
    perks: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check employer verification status
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const res = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVerificationStatus(res.data.isVerifiedEmployer === true ? "verified" : res.data.verificationStatus || "pending");
      } catch (err) {
        setVerificationStatus("pending");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "employer") {
      checkVerification();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  // Early returns after all hooks are called
  if (!user || user.role !== "employer") {
    return <p className="p-10 text-center">Access denied</p>;
  }

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  // Show message if employer is not verified
  if (!user.isVerifiedEmployer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Verification Pending
          </h2>
          <p className="text-gray-600 mb-6">
            Your employer account is awaiting verification by our admin team. 
            Once approved, you'll be able to post internships and hire students.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Status:</strong> {verificationStatus === "verified" ? "Verified ✅" : "Pending Review"}
            </p>
            <p className="text-xs text-yellow-700 mt-2">
              Please wait for admin approval. This usually takes 24-48 hours.
            </p>
          </div>
          <button
            onClick={() => navigate("/employer-dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

    try {
      setSubmitting(true);

      await api.post(
        "/api/tasks",
        {
          title: form.title,
          description: form.description,
          stipend: Number(form.stipend),

          skills: form.skills.split(",").map(s => s.trim()),
          locations: form.locations.split(",").map(l => l.trim()),

          experience: form.experience,
          startDate: form.startDate,
          applyBy: form.applyBy,

          responsibilities: form.responsibilities
            ? form.responsibilities.split("\n")
            : [],

          eligibility: form.eligibility
            ? form.eligibility.split("\n")
            : [],

          perks: form.perks
            ? form.perks.split("\n")
            : [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Internship posted successfully 🎉");
      setTimeout(() => navigate("/employer-dashboard"), 1200);

    } catch (err) {
      setError("Failed to create internship");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create Internship
          </h2>
          <p className="text-gray-500">
            Post a detailed internship opportunity for students
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="space-y-4">

          <input
            placeholder="Internship Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />

          <textarea
            placeholder="Internship Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input h-28"
          />

          <input
            placeholder="Skills (React, Node, MongoDB) *"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="input"
          />

          <input
            placeholder="Locations (Delhi, Bangalore) *"
            value={form.locations}
            onChange={(e) => setForm({ ...form, locations: e.target.value })}
            className="input"
          />

          <input
            placeholder="Experience (0 years)"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            className="input"
          />

          <input
            placeholder="Stipend (₹) *"
            value={form.stipend}
            onChange={(e) => setForm({ ...form, stipend: e.target.value })}
            className="input"
          />

          <input
            type="date"
            value={form.applyBy}
            onChange={(e) => setForm({ ...form, applyBy: e.target.value })}
            className="input"
          />

          <textarea
            placeholder="Responsibilities (one per line)"
            value={form.responsibilities}
            onChange={(e) =>
              setForm({ ...form, responsibilities: e.target.value })
            }
            className="input h-28"
          />

          <textarea
            placeholder="Eligibility (one per line)"
            value={form.eligibility}
            onChange={(e) =>
              setForm({ ...form, eligibility: e.target.value })
            }
            className="input h-28"
          />

          <textarea
            placeholder="Perks (one per line)"
            value={form.perks}
            onChange={(e) => setForm({ ...form, perks: e.target.value })}
            className="input h-28"
          />

        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Internship"}
        </button>
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
