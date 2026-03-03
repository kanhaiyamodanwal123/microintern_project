import { useState } from "react";
import api from "../api/api";

export default function RateUser({ taskId, targetId }) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  const submit = async () => {
    await api.post(
      "/api/ratings",
      { taskId, targetId, score, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Rating submitted!");
  };

  return (
    <div>
      <h4>Rate User</h4>

      <input
        type="number"
        min="1"
        max="5"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />

      <input
        placeholder="Comment"
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
