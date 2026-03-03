import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await api.put(`/api/auth/reset-password/${token}`, { password });
    setMsg(res.data.msg);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Reset Password
        </button>
        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </div>
    </div>
  );
}