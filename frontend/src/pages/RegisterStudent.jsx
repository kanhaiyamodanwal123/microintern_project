import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
    year: "",
    degree: "",
    branch: "",
    graduationYear: "",
    interest: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.collegeName || !form.degree) {
      setError("Please fill in college name and degree");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/auth/register", {
        ...form,
        role: "student",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = ["Web Development", "App Development", "Data Science", "AI/ML", "Design", "Marketing"];

  return (
    <div className="min-h-screen bg-white flex">

      {/* LEFT HERO - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 lg:px-12 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-lg space-y-8">
          
          <div className="space-y-2">
            <p className="text-blue-600 font-semibold tracking-widest text-sm">
              🎓 STUDENT PORTAL
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Start your<br/>
              <span className="text-blue-600">career journey</span>
            </h1>
          </div>

          <div className="space-y-4">
            {[
              { icon: "📁", title: "Build Your Portfolio", desc: "Showcase your work to employers", color: "green" },
              { icon: "🎯", title: "Apply to Real Projects", desc: "Get hands-on experience", color: "blue" },
              { icon: "🚀", title: "Get Hired Faster", desc: "Stand out to recruiters", color: "purple" },
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">💡 Pro Tip:</span> Verified students get 3x more responses from employers. Complete your profile after registration!
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT REGISTER CARD */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Progress Bar */}
          <div className="bg-gray-50 px-6 lg:px-8 pt-6">
            <div className="flex items-center justify-between mb-4">
              {[
                { num: 1, label: "Account" },
                { num: 2, label: "Education" },
                { num: 3, label: "Details" }
              ].map((item, index) => (
                <div key={item.num} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= item.num ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= item.num 
                        ? 'bg-blue-600 text-white scale-110' 
                        : 'bg-gray-200'
                    }`}>
                      {step > item.num ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : item.num}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
                  </div>
                  {index < 2 && (
                    <div className="w-8 lg:w-12 h-1 mx-1 lg:mx-2 bg-gray-200 rounded">
                      <div 
                        className="h-1 rounded transition-all duration-500 bg-blue-600" 
                        style={{ width: step > item.num ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 1 && "Create Your Account"}
                {step === 2 && "Education Details"}
                {step === 3 && "Additional Info"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {step === 1 && "Let's get you started"}
                {step === 2 && "Tell us about your college"}
                {step === 3 && "Help us know you better"}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* STEP 1: Account Info */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Name Input */}
                <div className={`transition-all duration-300 ${focused === 'name' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'name' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className={`transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">College Email *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@college.edu"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'email' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className={`transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-14 py-3 transition-all duration-300 outline-none ${
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
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>
              </div>
            )}

            {/* STEP 2: Education */}
            {step === 2 && (
              <div className="space-y-4">
                <div className={`transition-all duration-300 ${focused === 'collegeName' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">College Name *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <input
                      name="collegeName"
                      placeholder="Your College/University"
                      value={form.collegeName}
                      onChange={handleChange}
                      onFocus={() => setFocused('collegeName')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'collegeName' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focused === 'degree' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </span>
                    <input
                      name="degree"
                      placeholder="B.Tech / BCA / B.Sc / B.Com"
                      value={form.degree}
                      onChange={handleChange}
                      onFocus={() => setFocused('degree')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'degree' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focused === 'branch' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch/Stream</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </span>
                    <input
                      name="branch"
                      placeholder="CSE / IT / Mechanical / Commerce"
                      value={form.branch}
                      onChange={handleChange}
                      onFocus={() => setFocused('branch')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'branch' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`transition-all duration-300 ${focused === 'graduationYear' ? 'transform scale-[1.01]' : ''}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Graduation Year</label>
                    <input
                      name="graduationYear"
                      placeholder="2027"
                      value={form.graduationYear}
                      onChange={handleChange}
                      onFocus={() => setFocused('graduationYear')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl px-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'graduationYear' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Year</label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none hover:border-gray-300 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all duration-300"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Additional Info */}
            {step === 3 && (
              <div className="space-y-5">
                <div className={`transition-all duration-300 ${focused === 'interest' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Area of Interest</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </span>
                    <input
                      name="interest"
                      placeholder="Web Development / AI / Design / Marketing"
                      value={form.interest}
                      onChange={handleChange}
                      onFocus={() => setFocused('interest')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'interest' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">🎉 Almost done!</span> After registration, you can complete your profile with skills, resume, and projects to attract employers.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => setForm({ ...form, interest })}
                      className={`p-3 rounded-xl text-sm border-2 transition-all duration-300 ${
                        form.interest === interest
                          ? "border-blue-600 bg-blue-50 text-blue-600 font-semibold shadow-md"
                          : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  ← Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Account ✓"
                  )}
                </button>
              )}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer font-semibold hover:text-blue-800 transition-colors"
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
