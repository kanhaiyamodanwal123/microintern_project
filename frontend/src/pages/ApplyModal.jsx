import { useEffect, useState } from "react";
import api from "../api/api";

export default function ApplyModal({ taskId, onClose, onDone }) {
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");

  const load = async () => {
    const res = await api.get("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm(res.data || {});
  };

  useEffect(() => {
    load();
  }, []);

  const apply = async () => {
    const formData = new FormData();

    Object.keys(form).forEach(key => {
      if (form[key] !== undefined && form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    await api.post(`/api/tasks/apply/${taskId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Application submitted!");
    onDone();
    onClose();
  };

  const input = "w-full border p-2 rounded mt-1";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold text-center">
          Confirm Internship Application
        </h2>

        {/* Name */}
        <Field label="Full Name">
          <input className={input}
            value={form.name || ""}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        {/* Phone */}
        <Field label="Contact Number">
          <input className={input}
            value={form.phone || ""}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </Field>

        {/* Address */}
        <Field label="Address">
          <input className={input}
            value={form.address || ""}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
        </Field>

        {/* College */}
        <Field label="College Name">
          <input className={input}
            value={form.collegeName || ""}
            onChange={e => setForm({ ...form, collegeName: e.target.value })}
          />
        </Field>

        {/* Skills */}
        <Field label="Skills">
          <input className={input}
            value={form.skills?.join(", ") || ""}
            onChange={e =>
              setForm({ ...form, skills: e.target.value.split(",") })
            }
          />
        </Field>

        {/* Bio */}
        <Field label="Short Bio">
          <textarea className={input}
            value={form.bio || ""}
            onChange={e => setForm({ ...form, bio: e.target.value })}
          />
        </Field>

        {/* Links */}
        <Field label="GitHub Link">
          <input className={input}
            value={form.github || ""}
            onChange={e => setForm({ ...form, github: e.target.value })}
          />
        </Field>

        <Field label="LinkedIn Link">
          <input className={input}
            value={form.linkedin || ""}
            onChange={e => setForm({ ...form, linkedin: e.target.value })}
          />
        </Field>

        <Field label="Live Project Link">
          <input className={input}
            value={form.project || ""}
            onChange={e => setForm({ ...form, project: e.target.value })}
          />
        </Field>

        {/* Files */}
        <Field label="Upload Resume">
          <input type="file"
            onChange={e => setForm({ ...form, resume: e.target.files[0] })}
          />
        </Field>

        <Field label="Profile Photo">
          <input type="file"
            onChange={e => setForm({ ...form, photo: e.target.files[0] })}
          />
        </Field>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={apply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Internship
          </button>
        </div>

      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
