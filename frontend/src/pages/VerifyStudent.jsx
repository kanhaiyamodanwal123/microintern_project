import { useState, useEffect } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";

export default function VerifyStudent() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Get current verification status based on role
    const checkStatus = async () => {
      try {
        const res = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (user?.role === "employer") {
          setStatus(res.data.verificationStatus);
          setIsVerified(res.data.isVerifiedEmployer === true);
        } else {
          setStatus(res.data.verificationStatus);
          setIsVerified(res.data.isVerifiedStudent === true);
        }
      } catch (err) {
        console.error("Failed to get status");
      } finally {
        setLoadingStatus(false);
      }
    };
    
    if (user) {
      checkStatus();
    }
  }, [user, token]);

  const upload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    // Use different endpoint and field name for employer vs student
    if (user?.role === "employer") {
      formData.append("doc", file);
    } else {
      formData.append("id", file);
    }

    try {
      const endpoint = user?.role === "employer" 
        ? "/api/verification/upload-employer-doc" 
        : "/api/verification/upload-id";
      
      await api.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uploaded! Waiting for admin approval.");
      setStatus("pending");
      setIsVerified(false);
      
      // Refresh user data
      const res = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (user?.role === "employer") {
        setStatus(res.data.verificationStatus);
      } else {
        setStatus(res.data.verificationStatus);
      }
      
    } catch (err) {
      alert(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusMessage = () => {
    const userType = user?.role === "employer" ? "employer" : "student";
    
    switch (status) {
      case "verified":
        return user?.role === "employer" 
          ? "✅ Your company is verified! You can now post internships and hire students."
          : "✅ Your account is verified! You can now apply to internships.";
      case "pending":
        return "⏳ Your verification is pending. Please wait for admin approval.";
      case "rejected":
        return "❌ Your verification was rejected. Please contact support or re-upload documents.";
      default:
        return user?.role === "employer"
          ? "Please upload your company registration document for verification."
          : "Please upload your student ID for verification.";
    }
  };

  // Show verified badge if already verified
  if (!loadingStatus && isVerified) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {user?.role === "employer" ? "Employer" : "Student"} Verification
        </h2>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            {user?.role === "employer" ? "Company Verified!" : "You're Verified!"}
          </h3>
          <p className="text-green-700 text-lg">
            {user?.role === "employer" 
              ? "Your company is verified. You can now post internships and hire students."
              : "Your account is verified. You can now browse and apply to internships."}
          </p>
          <div className="mt-4 inline-block bg-green-200 text-green-800 px-4 py-2 rounded-full font-semibold">
            ✓ {user?.role === "employer" ? "Verified Employer" : "Verified Student"}
          </div>
        </div>
      </div>
    );
  }

  if (loadingStatus) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {user?.role === "employer" ? "Employer" : "Student"} Verification
      </h2>

      {/* Status Card */}
      <div className={`p-4 rounded-xl border mb-6 ${getStatusColor()}`}>
        <p className="font-medium">{getStatusMessage()}</p>
      </div>

      {status !== "verified" && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {user?.role === "employer" 
                ? "Upload Company Registration Document" 
                : "Upload Student ID Card"}
            </label>
            <p className="text-xs text-gray-500 mb-3">
              {user?.role === "employer"
                ? "Accepted formats: JPG, PNG, PDF (GST Certificate, Company Registration, etc.)"
                : "Accepted formats: JPG, PNG, PDF"}
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {file && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            </div>
          )}

          <button
            onClick={upload}
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload for Verification"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            {user?.role === "employer"
              ? "After upload, our admin team will verify your company documents within 24-48 hours."
              : "After upload, our admin team will verify your student ID within 24-48 hours."}
          </p>
        </div>
      )}
    </div>
  );
}

