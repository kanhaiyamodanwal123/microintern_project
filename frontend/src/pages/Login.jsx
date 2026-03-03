import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import useAuth from "../context/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  // Redirect AFTER user is loaded
  useEffect(() => {
    if (!user) return;

    if (user.role === "student") navigate("/", { replace: true });
    if (user.role === "employer") navigate("/employer-dashboard", { replace: true });
    if (user.role === "admin") navigate("/admin", { replace: true });

  }, [user, navigate]);

  // Login submit
  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      setError("");
      setLoading(true);

      const res = await api.post("/api/auth/login", form);
      login(res.data);

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* LEFT PANEL - Promotional */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 lg:p-12 space-y-6 hidden lg:block">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              New to MicroIntern?
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of students finding their dream internships
            </p>
          </div>

          <ul className="space-y-4 text-gray-700">
            {[
              { icon: "⚡", text: "One-click apply using your student profile" },
              { icon: "🎯", text: "Get personalized internship recommendations" },
              { icon: "💼", text: "Showcase portfolio to top startups" },
              { icon: "📊", text: "Track all applications in one place" },
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-base">{item.text}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/register")}
            className="mt-6 w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Register for Free →
          </button>

          <div className="pt-8 flex justify-center">
            <div className="flex -space-x-4">
              {["🎓", "💼", "🚀", "⭐"].map((emoji, i) => (
                <div key={i} className="w-12 h-12 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm">Join 10,000+ students</p>
        </div>

        {/* RIGHT PANEL - Login Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-10 space-y-6 border border-gray-100">
          <div className="text-center space-y-2">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome Back
            </h3>
            <p className="text-gray-500">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Input */}
            <div className={`relative transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.02]' : ''}`}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email ID</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  onKeyPress={handleKeyPress}
                  className={`w-full border-2 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                    focused === 'email' 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className={`relative transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.02]' : ''}`}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  onKeyPress={handleKeyPress}
                  className={`w-full border-2 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                    focused === 'password' 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={submit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:shadow-blue-200 hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <p 
  onClick={() => navigate("/forgot-password")}
  className="text-center text-blue-600 text-sm cursor-pointer hover:underline"
>
  Forgot Password?
</p>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button className="w-full border-2 border-gray-200 rounded-xl py-3 font-medium flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-6 h-6"
                alt="google"
              />
              Continue with Google
            </button>
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
              Register now
            </button>
          </p>

          {/* Mobile only - Register link */}
          <div className="lg:hidden text-center pt-4 border-t">
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-medium hover:underline"
            >
              New to MicroIntern? Register for Free
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
