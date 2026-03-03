import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import useAuth from "../context/useAuth";
import ApplyModal from "./ApplyModal";

export default function InternshipDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [internship, setInternship] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [saved, setSaved] = useState(
  JSON.parse(localStorage.getItem("savedInternships") || "[]")
);
const toggleSave = (id) => {
  const updated = saved.includes(id)
    ? saved.filter(x => x !== id)
    : [...saved, id];

  setSaved(updated);
  localStorage.setItem("savedInternships", JSON.stringify(updated));
};
  useEffect(() => {
    api.get(`/api/tasks/${id}`).then(res => setInternship(res.data));
  }, [id]);

  if (!internship) {
    return <p className="p-10 text-center">Loading internship...</p>;
  }
const hasApplied =
  !!user &&
  internship.applicants?.some(
    a =>
      a.student === user._id ||
      a.student?._id === user._id
  );

 const applyNow = () => {
  if (!user) return setShowLogin(true);

  if (hasApplied) {
    alert("You have already applied for this internship");
    return;
  }

  const verified =
    user.isVerifiedStudent === true ||
    user.verificationStatus === "approved";

  if (!verified) return setShowVerify(true);

  setShowApply(true);
};

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* TOP CARD */}
        <div className="bg-white rounded-xl border p-6 space-y-5">

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-gray-900">
            {internship.title}
          </h1>

          {/* COMPANY */}
          <p className="text-gray-600 font-medium">
            {internship.employer?.name}
          </p>

          {/* LOCATION */}
          <p className="text-gray-500 flex items-center gap-2">
            📍 {internship.locations?.join(", ") || "Delhi, Hyderabad, Bangalore"}
          </p>

          {/* META INFO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">

            <div className="flex items-start gap-3">
              <span className="text-gray-400">🗓</span>
              <div>
                <p className="text-xs text-gray-500 uppercase">Start Date</p>
                <p className="font-medium">
                  {internship.startDate || "Immediately"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-gray-400">💰</span>
              <div>
                <p className="text-xs text-gray-500 uppercase">Stipend</p>
                <p className="font-medium">
                  ₹ {internship.stipend}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-gray-400">🧳</span>
              <div>
                <p className="text-xs text-gray-500 uppercase">Experience</p>
                <p className="font-medium">
                  {internship.experience || "0 year(s)"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-gray-400">⏰</span>
              <div>
                <p className="text-xs text-gray-500 uppercase">Apply By</p>
                <p className="font-medium">
                  {internship.applyBy
                    ? new Date(internship.applyBy).toDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

          </div>

          {/* TAGS */}
          <div className="flex gap-3 pt-2">
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
              🕒 Posted recently
            </span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
              Fresher Job
            </span>
          </div>
          

          {/* ACTION BAR */}
          {/* ACTION BAR */}
<div className="flex justify-between items-center pt-4 border-t gap-4">

  {/* LEFT */}
  <p className="text-sm text-gray-500 flex items-center gap-2">
    👥 {internship.applicants?.length || 0} applicants
  </p>

  {/* RIGHT BUTTONS */}
  {/* RIGHT BUTTONS */}
{user?.role !== "employer" && (
  <div className="flex gap-3">

    {/* SAVE BUTTON */}
    <button
      onClick={() => toggleSave(internship._id)}
      className={`px-5 py-2 rounded-lg font-medium border transition
        ${
          saved.includes(internship._id)
            ? "bg-red-50 text-red-600 border-red-200"
            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
        }`}
    >
      {saved.includes(internship._id) ? "❤️ Saved" : "🤍 Save"}
    </button>

    {/* APPLY BUTTON */}
    <button
      onClick={applyNow}
      disabled={hasApplied}
      className={`px-6 py-2.5 rounded-lg font-semibold
        ${
          hasApplied
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
    >
      {hasApplied ? "Already Applied" : "Apply now"}
    </button>

  </div>
)}
</div>
 </div>       

        {/* ABOUT JOB */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-bold">About the internship</h2>
          <p className="text-gray-700 leading-relaxed">
            {internship.description}
          </p>
        </div>

        {/* SKILLS */}
        {internship.skills?.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="text-lg font-bold">Skills required</h2>
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-700
                             px-3 py-1 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RESPONSIBILITIES */}
        {internship.responsibilities?.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="text-lg font-bold">Responsibilities</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {internship.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ELIGIBILITY */}
        {internship.eligibility?.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="text-lg font-bold">Eligibility</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {internship.eligibility.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* PERKS */}
        {internship.perks?.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="text-lg font-bold">Perks</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {internship.perks.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* APPLY MODAL */}
      {showApply && (
        <ApplyModal
          taskId={internship._id}
          onClose={() => setShowApply(false)}
          onDone={() => setShowApply(false)}
        />
      )}

      {showLogin && alert("Please login to apply")}
      {showVerify && alert("Please verify your student profile")}
    </div>
  );
}