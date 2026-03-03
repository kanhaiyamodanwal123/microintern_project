import { useState } from "react";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await api.post("/api/auth/forgot-password", { email });
    setMsg(res.data.msg);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full border p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Send Reset Link
        </button>
        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </div>
    </div>
  );
}