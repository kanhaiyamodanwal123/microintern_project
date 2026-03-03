import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";
import ApplyModal from "./ApplyModal";

export default function TaskMarketplace() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [applyTaskId, setApplyTaskId] = useState(null);

  const token = localStorage.getItem("token");

  if (!user || user.role !== "student") {
    return <p className="p-10 text-center">Access denied</p>;
  }

  const load = async () => {
    const res = await api.get("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      <h2 className="text-2xl font-bold">Live Internship Tasks</h2>

      {tasks.length === 0 && (
        <p className="text-gray-500">No tasks available right now</p>
      )}

      {tasks.map(task => {
        const alreadyApplied = task.applicants?.some(
          a => a.student === user.id || a.student?._id === user.id
        );

        return (
          <div
            key={task._id}
            className="bg-white border rounded-xl p-5 shadow-sm space-y-2"
          >
            <h3 className="font-semibold text-lg">{task.title}</h3>

            <p className="text-gray-600">{task.description}</p>

            <p className="text-sm">
              <b>Skills:</b> {task.skills.join(", ")}
            </p>

            <p className="text-sm">
              <b>Stipend:</b> ₹{task.stipend}
            </p>

            <p className="text-sm text-gray-500">
              Employer: {task.employer?.name}
            </p>

            <button
              disabled={alreadyApplied}
              onClick={() => setApplyTaskId(task._id)}
              className={`mt-2 px-4 py-2 rounded text-white ${
                alreadyApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {alreadyApplied ? "Applied" : "Apply"}
            </button>
          </div>
        );
      })}

      {/* Apply Modal */}
      {applyTaskId && (
        <ApplyModal
          taskId={applyTaskId}
          onClose={() => setApplyTaskId(null)}
          onDone={load}
        />
      )}

    </div>
  );
}
