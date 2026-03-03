import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function RegisterEmployer() {
  const navigate = useNavigate();
  const logoInputRef = useRef(null);

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setDocuments({ ...documents, [name]: files[0] });
      
      // Preview logo
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex">

      {/* LEFT HERO */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-12 py-8">
        <div className="max-w-lg space-y-8">
          
          <div className="space-y-2">
            <p className="text-blue-400 font-semibold tracking-widest text-sm">
              🏢 EMPLOYER PORTAL
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Hire the best<br/>
              <span className="text-blue-400">student talent</span>
            </h1>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold">Access Verified Students</h3>
                <p className="text-sm text-gray-400">Browse thousands of vetted college students</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold">Post in Minutes</h3>
                <p className="text-sm text-gray-400">Create micro-internships quickly</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">📈</div>
              <div>
                <h3 className="font-semibold">Build Your Pipeline</h3>
                <p className="text-sm text-gray-400">Find talent for future opportunities</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
            <p className="text-sm text-yellow-200">
              <span className="font-semibold">⏳ Verification Required:</span> After registration, 
              our team will verify your company documents. Once approved, you can start posting internships.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT REGISTER CARD */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-xl bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gray-100 px-8 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
                <span className="text-sm font-medium">Account</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-300 rounded">
                <div className={`h-1 rounded transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
                <span className="text-sm font-medium">Company</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-300 rounded">
                <div className={`h-1 rounded transition-all ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
                <span className="text-sm font-medium">Documents</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
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
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* STEP 1: Account Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>
              </div>
            )}

            {/* STEP 2: Company Info */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                  <input
                    name="companyName"
                    placeholder="Acme Technologies Pvt Ltd"
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Website</label>
                  <input
                    name="companyWebsite"
                    type="url"
                    placeholder="https://www.company.com"
                    value={form.companyWebsite}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    name="companyPhone"
                    placeholder="+91 98765 43210"
                    value={form.companyPhone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Address</label>
                  <textarea
                    name="companyAddress"
                    placeholder="123 Business Park, Tech City, Mumbai - 400001"
                    rows={2}
                    value={form.companyAddress}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Description</label>
                  <textarea
                    name="companyDescription"
                    placeholder="Tell us about your company, what you do, and what kind of interns you're looking for..."
                    rows={3}
                    value={form.companyDescription}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
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
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                  >
                    {previewLogo ? (
                      <div className="relative inline-block">
                        <img src={previewLogo} alt="Logo preview" className="w-24 h-24 object-contain mx-auto rounded-lg" />
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
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition">
                    {documents.companyRegistrationDoc ? (
                      <div className="space-y-2">
                        <div className="text-4xl">📄</div>
                        <p className="text-sm font-medium text-gray-700">{documents.companyRegistrationDoc.name}</p>
                        <p className="text-xs text-green-600">✓ File selected</p>
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
                    name="companyRegistrationDoc"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="companyRegDoc"
                  />
                  <label 
                    htmlFor="companyRegDoc" 
                    className="block mt-2 text-center text-sm text-blue-600 cursor-pointer hover:underline"
                  >
                    {documents.companyRegistrationDoc ? "Change file" : "Click to upload"}
                  </label>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
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
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Submit for Verification"}
                </button>
              )}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer font-medium hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

