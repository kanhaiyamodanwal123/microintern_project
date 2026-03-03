import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");

  const isEmployer = user?.role === "employer";

  const load = async () => {
    try {
      const res = await api.get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data || {});
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const save = async () => {
    const formData = new FormData();

    Object.keys(form).forEach(key => {
      if (form[key] !== undefined && form[key] !== null) {
        if (key === "skills" && Array.isArray(form.skills)) {
          formData.append("skills", form.skills.join(","));
        } else {
          formData.append(key, form[key]);
        }
      }
    });

    try {
      await api.put("/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated!");
      load();
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const input = "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none";

  // Employer Profile
  if (isEmployer) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">Employer Profile</h2>

        <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Company:</b> {user.companyName || "Not set"}</p>
          <p><b>Verification Status:</b> {user.isVerifiedEmployer ? "✅ Verified" : "⏳ Pending"}</p>
        </div>

        <Section title="Company Information">
          <Field label="Company Name">
            <input 
              value={form.companyName || user.companyName || ""} 
              onChange={e => setForm({ ...form, companyName: e.target.value })} 
              className={input} 
              placeholder="Your Company Name"
            />
          </Field>
          <Field label="Company Website">
            <input 
              value={form.companyWebsite || user.companyWebsite || ""} 
              onChange={e => setForm({ ...form, companyWebsite: e.target.value })} 
              className={input} 
              placeholder="https://yourcompany.com"
            />
          </Field>
          <Field label="Company Phone">
            <input 
              value={form.companyPhone || user.companyPhone || ""} 
              onChange={e => setForm({ ...form, companyPhone: e.target.value })} 
              className={input} 
              placeholder="+91 9876543210"
            />
          </Field>
          <Field label="Company Address">
            <textarea 
              value={form.companyAddress || user.companyAddress || ""} 
              onChange={e => setForm({ ...form, companyAddress: e.target.value })} 
              className={input} 
              placeholder="Full company address"
              rows={2}
            />
          </Field>
          <Field label="Company Description">
            <textarea 
              value={form.companyDescription || user.companyDescription || ""} 
              onChange={e => setForm({ ...form, companyDescription: e.target.value })} 
              className={input} 
              placeholder="Brief description about your company"
              rows={3}
            />
          </Field>
        </Section>

        <Section title="Company Logo">
          <div className="space-y-1">
            <label className="text-sm font-medium">Company Logo</label>
            {(form.companyLogo || user.companyLogo) && (
              <div className="mb-2">
                <img 
                  src={form.companyLogo || user.companyLogo} 
                  alt="Company Logo" 
                  className="w-24 h-24 rounded-lg object-cover border" 
                />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setForm({ ...form, companyLogo: e.target.files[0] })} 
              className="w-full border rounded-lg px-3 py-2" 
            />
          </div>
        </Section>

        <button onClick={save} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          Save Profile
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Keep your company profile updated to attract more students. 
            Make sure your company is verified to post internships.
          </p>
        </div>
      </div>
    );
  }

  // Student Profile (original)
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Student Profile</h2>

      <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>

      <Section title="Basic Information">
        <Field label="Age">
          <input type="number" value={form.age || ""} onChange={e => setForm({ ...form, age: Number(e.target.value) })} className={input} />
        </Field>
        <Field label="Address">
          <input value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} className={input} />
        </Field>
        <Field label="Phone Number">
          <input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} className={input} />
        </Field>
      </Section>

      <Section title="College & Academic Information">
        <Field label="College Name">
          <input value={form.collegeName || ""} onChange={e => setForm({ ...form, collegeName: e.target.value })} className={input} />
        </Field>
        <Field label="College Email">
          <input value={form.collegeEmail || ""} onChange={e => setForm({ ...form, collegeEmail: e.target.value })} className={input} />
        </Field>
        <Field label="Degree">
          <input value={form.degree || ""} onChange={e => setForm({ ...form, degree: e.target.value })} placeholder="B.Tech / BCA / B.Sc" className={input} />
        </Field>
        <Field label="Branch / Stream">
          <input value={form.branch || ""} onChange={e => setForm({ ...form, branch: e.target.value })} placeholder="CSE / IT / Mechanical" className={input} />
        </Field>
        <Field label="Current Year of Study">
          <input value={form.year || ""} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="1st / 2nd / 3rd / Final" className={input} />
        </Field>
        <Field label="Graduation Year">
          <input type="number" value={form.graduationYear || ""} onChange={e => setForm({ ...form, graduationYear: Number(e.target.value) })} placeholder="2027" className={input} />
        </Field>
        <Field label="Internship Interest">
          <input value={form.interest || ""} onChange={e => setForm({ ...form, interest: e.target.value })} placeholder="Web / AI / Design / Data" className={input} />
        </Field>
      </Section>

      <Section title="Skills & Bio">
        <Field label="Skills (comma separated)">
          <input value={form.skills?.join(", ") || ""} onChange={e => setForm({ ...form, skills: e.target.value.split(",").map(s => s.trim()) })} className={input} />
        </Field>
        <Field label="Short Bio">
          <textarea value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} className={input} />
        </Field>
      </Section>

      <Section title="Professional Links">
        <Field label="GitHub">
          <input value={form.github || ""} onChange={e => setForm({ ...form, github: e.target.value })} className={input} />
        </Field>
        <Field label="LinkedIn">
          <input value={form.linkedin || ""} onChange={e => setForm({ ...form, linkedin: e.target.value })} className={input} />
        </Field>
        <Field label="Live Project Link">
          <input value={form.project || ""} onChange={e => setForm({ ...form, project: e.target.value })} className={input} />
        </Field>
      </Section>

      <Section title="Documents">
        <div className="space-y-1">
          <label className="text-sm font-medium">Profile Photo</label>
          {form.photo && <div className="mb-2"><img src={form.photo} alt="Profile" className="w-20 h-20 rounded-lg object-cover" /></div>}
          <input type="file" accept="image/*" onChange={e => setForm({ ...form, photo: e.target.files[0] })} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">College ID Card</label>
          {form.collegeIdCard && <p className="text-sm text-green-600 mb-1">✓ ID Card uploaded</p>}
          <input type="file" accept="image/*,.pdf" onChange={e => setForm({ ...form, collegeIdCard: e.target.files[0] })} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Resume (PDF/DOC)</label>
          {form.resume && (
            <div className="flex items-center gap-2 mb-2">
              <a href={form.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">📄 View Uploaded Resume</a>
            </div>
          )}
          <input type="file" accept=".pdf,.doc,.docx" onChange={e => setForm({ ...form, resume: e.target.files[0] })} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </Section>

      <button onClick={save} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
        Save Profile
      </button>

      <p className="text-sm text-gray-600 text-center">
        Verification: {form.verified ? "✅ Verified" : "⏳ Pending"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

