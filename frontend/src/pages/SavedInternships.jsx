import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function SavedInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const savedIds = JSON.parse(localStorage.getItem("savedInternships") || "[]");

  const load = async () => {
    const res = await api.get("/api/tasks/public");
    const filtered = res.data.filter(t => savedIds.includes(t._id));
    setInternships(filtered);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      <h2 className="text-3xl font-bold">Saved Internships ❤️</h2>

      {!internships.length && (
        <p className="text-gray-500">No saved internships yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {internships.map(task => (
          <div key={task._id}
            className="bg-white border rounded-xl p-6 shadow space-y-3">

            <h3 className="font-bold text-lg">{task.title}</h3>

            <p className="text-gray-600 text-sm">{task.description}</p>

            <p className="text-sm">
              <b>Company:</b> {task.employer?.name}
            </p>

            <button
              onClick={() => navigate(`/internship/${task._id}`)}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              View Details
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}