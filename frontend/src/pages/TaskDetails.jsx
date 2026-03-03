import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTask(res.data));
  }, []);

  if (!task) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">{task.title}</h2>

      <p>{task.description}</p>

      <p>
        Skills: {task.skills.join(", ")}
      </p>

      <p>
        Stipend: {task.stipend}
      </p>

      <p>Status: {task.status}</p>
    </div>
  );
}
