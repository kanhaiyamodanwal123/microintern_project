import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../context/useAuth";

export default function EmployerBanner() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showPopup, setShowPopup] = useState(false);

  const handlePostNow = () => {
    // ✅ Employer → create task
    if (user && user.role === "employer") {
      navigate("/create-task");
      return;
    }

    // ❌ Student or not logged in → popup
    setShowPopup(true);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e3a5f] to-[#3b73b9] text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">

          {/* LEFT CONTENT - Person & Info */}
          <div className="flex items-center gap-6">
            {/* Professional Person Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {/* Professional Person Illustration */}
                  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="48" fill="#e8f4fc"/>
                    {/* Body */}
                    <path d="M20 95 Q20 65 50 65 Q80 65 80 95 Z" fill="#3b73b9"/>
                    {/* Suit collar */}
                    <path d="M35 65 L50 80 L65 65" fill="#1e3a5f"/>
                    {/* Neck */}
                    <rect x="42" y="50" width="16" height="18" fill="#f5d0c5"/>
                    {/* Head */}
                    <circle cx="50" cy="35" r="18" fill="#f5d0c5"/>
                    {/* Hair */}
                    <path d="M32 30 Q32 15 50 15 Q68 15 68 30 Q68 25 50 25 Q32 25 32 30" fill="#2d2d2d"/>
                    {/* Eyes */}
                    <circle cx="43" cy="35" r="3" fill="#2d2d2d"/>
                    <circle cx="57" cy="35" r="3" fill="#2d2d2d"/>
                    {/* Smile */}
                    <path d="M44 42 Q50 47 56 42" fill="none" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
                    {/* Glasses */}
                    <circle cx="43" cy="35" r="7" fill="none" stroke="#2d2d2d" strokeWidth="1.5"/>
                    <circle cx="57" cy="35" r="7" fill="none" stroke="#2d2d2d" strokeWidth="1.5"/>
                    <line x1="50" y1="35" x2="50" y2="35" stroke="#2d2d2d" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              {/* Status indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            
            {/* Person Details */}
            <div className="space-y-2">
              <p className="text-yellow-400 font-medium">Trusted by 500+ Companies</p>
              <p className="text-white/80 text-sm">Join leading organizations hiring on MicroIntern</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
                <span className="text-white/70 text-xs ml-1">(4.9/5)</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">
            <span className="inline-block border border-white/40
                             rounded-full px-4 py-1 text-sm tracking-wide bg-white/10">
              MICROINTERN FOR EMPLOYERS
            </span>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Looking to hire freshers and interns?
            </h2>

            <p className="text-white/90 text-lg">
              Access India's growing talent pool with AI-powered matching
              and smart filters to hire faster on MicroIntern.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handlePostNow}
                className="inline-flex items-center gap-2
                           bg-yellow-400 hover:bg-yellow-500
                           text-black font-semibold
                           px-8 py-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Post now for free
                <span className="text-xl">→</span>
              </button>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="text-center">
                  <p className="font-bold text-white text-lg">10K+</p>
                  <p>Interns</p>
                </div>
                <div className="w-px h-10 bg-white/30"></div>
                <div className="text-center">
                  <p className="font-bold text-white text-lg">500+</p>
                  <p>Companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <RegisterEmployerPopup
          onClose={() => setShowPopup(false)}
          onRegister={() => navigate("/employer")}
        />
      )}
    </>
  );
}

/* ---------- POPUP COMPONENT ---------- */
function RegisterEmployerPopup({ onClose, onRegister }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md text-center space-y-4">

        <h3 className="text-xl font-bold text-gray-900">
          Register as an Employer
        </h3>

        <p className="text-gray-600">
          Only employers can post internships.
          Please register or login as an employer to continue.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={onRegister}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium"
          >
            Register as Employer
          </button>

          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

