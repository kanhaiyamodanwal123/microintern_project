import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function RegisterEmployer() {
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const regDocInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    companyAddress: "",
    companyPhone: "",
  });

  const [documents, setDocuments] = useState({
    companyRegistrationDoc: null,
    companyLogo: null,
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setDocuments({ ...documents, [name]: files[0] });
      
      if (name === "companyLogo") {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewLogo(reader.result);
        reader.readAsDataURL(files[0]);
      }
    }
  };

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
    if (!form.companyName) {
      setError("Company name is required");
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
    if (!documents.companyRegistrationDoc) {
      setError("Company registration document is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append("role", "employer");

      if (documents.companyRegistrationDoc) {
        formData.append("companyRegistrationDoc", documents.companyRegistrationDoc);
      }
      if (documents.companyLogo) {
        formData.append("companyLogo", documents.companyLogo);
      }

      const res = await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", res.data.token);
      navigate("/employer-dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* LEFT HERO - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 lg:px-12 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-lg space-y-8">
          
          <div className="space-y-2">
            <p className="text-blue-600 font-semibold tracking-widest text-sm">
              🏢 EMPLOYER PORTAL
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Hire the best<br/>
              <span className="text-blue-600">student talent</span>
            </h1>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🎯", title: "Access Verified Students", desc: "Browse thousands of vetted college students", color: "blue" },
              { icon: "⚡", title: "Post in Minutes", desc: "Create micro-internships quickly", color: "green" },
              { icon: "📈", title: "Build Your Pipeline", desc: "Find talent for future opportunities", color: "purple" },
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

          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-sm text-yellow-700">
              <span className="font-semibold">⏳ Verification Required:</span> After registration, 
              our team will verify your company documents. Once approved, you can start posting internships.
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
                { num: 2, label: "Company" },
                { num: 3, label: "Documents" }
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
                {step === 2 && "Company Information"}
                {step === 3 && "Upload Documents"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {step === 1 && "Let's get you started with your account"}
                {step === 2 && "Tell us about your company"}
                {step === 3 && "Verify your company to start hiring"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@company.com"
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

            {/* STEP 2: Company Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className={`transition-all duration-300 ${focused === 'companyName' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <input
                      name="companyName"
                      placeholder="Acme Technologies Pvt Ltd"
                      value={form.companyName}
                      onChange={handleChange}
                      onFocus={() => setFocused('companyName')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'companyName' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focused === 'companyWebsite' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Website</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </span>
                    <input
                      name="companyWebsite"
                      type="url"
                      placeholder="https://www.company.com"
                      value={form.companyWebsite}
                      onChange={handleChange}
                      onFocus={() => setFocused('companyWebsite')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'companyWebsite' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focused === 'companyPhone' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input
                      name="companyPhone"
                      placeholder="+91 98765 43210"
                      value={form.companyPhone}
                      onChange={handleChange}
                      onFocus={() => setFocused('companyPhone')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none ${
                        focused === 'companyPhone' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focused === 'companyAddress' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <textarea
                      name="companyAddress"
                      placeholder="123 Business Park, Tech City, Mumbai - 400001"
                      rows={2}
                      value={form.companyAddress}
                      onChange={handleChange}
                      onFocus={() => setFocused('companyAddress')}
                      onBlur={() => setFocused(null)}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 transition-all duration-300 outline-none resize-none ${
                        focused === 'companyAddress' 
                          ? 'border-blue-500 shadow-lg shadow-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focused === 'companyDescription' ? 'transform scale-[1.01]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Description</label>
                  <textarea
                    name="companyDescription"
                    placeholder="Tell us about your company, what you do, and what kind of interns you're looking for..."
                    rows={3}
                    value={form.companyDescription}
                    onChange={handleChange}
                    onFocus={() => setFocused('companyDescription')}
                    onBlur={() => setFocused(null)}
                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all duration-300 outline-none resize-none ${
                      focused === 'companyDescription' 
                        ? 'border-blue-500 shadow-lg shadow-blue-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Documents */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Logo (Optional)</label>
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                  >
                    {previewLogo ? (
                      <div className="relative inline-block group">
                        <img src={previewLogo} alt="Logo preview" className="w-24 h-24 object-contain mx-auto rounded-lg shadow-md" />
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm">Change</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl">🏢</div>
                        <p className="text-sm text-gray-500">Click to upload logo</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    name="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Company Registration Doc */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Registration Document *
                  </label>
                  <div 
                    onClick={() => regDocInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                      documents.companyRegistrationDoc 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {documents.companyRegistrationDoc ? (
                      <div className="space-y-2">
                        <div className="text-4xl">📄</div>
                        <p className="text-sm font-medium text-gray-700">{documents.companyRegistrationDoc.name}</p>
                        <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          File selected - Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl">📎</div>
                        <p className="text-sm text-gray-500">Upload registration certificate</p>
                        <p className="text-xs text-gray-400">GST Certificate, Company Registration, etc.</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={regDocInputRef}
                    name="companyRegistrationDoc"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="companyRegDoc"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">ℹ️ Note:</span> Your documents will be reviewed by our admin team within 24-48 hours. You'll receive a notification once verified.
                  </p>
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
                      Registering...
                    </span>
                  ) : (
                    "Submit for Verification ✓"
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
