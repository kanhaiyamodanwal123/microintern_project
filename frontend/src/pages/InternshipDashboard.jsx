import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import ApplyModal from "./ApplyModal";
import EmployerBanner from "../components/EmployerBanner";

export default function InternshipDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [applyTaskId, setApplyTaskId] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedInternships") || "[]")
  );

  const load = async () => {
    try {
      const res = await api.get("/api/tasks/public");
      setInternships(res.data);
    } catch (err) {
      console.error("Failed to load internships", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSave = (id) => {
    const updated = saved.includes(id)
      ? saved.filter(x => x !== id)
      : [...saved, id];
    setSaved(updated);
    localStorage.setItem("savedInternships", JSON.stringify(updated));
  };

  const handleApplyClick = (id) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const verified =
      user.isVerifiedStudent === true ||
      user.verificationStatus === "approved";

    if (!verified) {
      setShowVerify(true);
      return;
    }

    navigate(`/internship/${id}`);
  };

  const filtered = internships.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    task.employer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    task.skills?.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchClick = () => {
    if (!search.trim()) return;
    navigate(`/internships?query=${encodeURIComponent(search)}`);
  };

  const roleCards = [
    { title: "Full Stack Developer", jobs: "24.2K+" },
    { title: "Mobile / App Developer", jobs: "3.1K+" },
    { title: "Front End Developer", jobs: "5.5K+" },
    { title: "DevOps Engineer", jobs: "3K+" },
    { title: "Engineering Manager", jobs: "1.7K+" },
    { title: "Technical Lead", jobs: "11.4K+" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-16">
        
        {/* HERO */}
        <div className="text-center space-y-5 py-12 lg:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-fade-in-up">
            Find your dream <span className="text-blue-600">internship</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Discover internships that match your skills and interests from top companies
          </p>

          <div className="flex justify-center mt-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className={`flex items-center w-full max-w-4xl bg-white rounded-full shadow-lg border-2 overflow-hidden transition-all duration-300 ${isSearchFocused ? 'border-blue-500 shadow-xl scale-[1.01]' : ''}`}>
              <div className="flex items-center flex-1 px-5">
                <span className="text-gray-400 text-xl mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  placeholder="Search by skills, roles, or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
                  className="w-full py-4 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSearchClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-sm font-semibold rounded-full m-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* PROMO BANNER */}
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <span className="text-orange-500 font-bold text-lg sm:text-xl">campus</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Introducing a career platform for college students & fresh grads
                </h3>
                <p className="text-sm text-gray-500 max-w-xl">
                  Explore contests, webinars, aptitude tests and find jobs & internships
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Expert speak", "Contests", "Aptitude test", "Pathfinder", "Jobs & Internships"].map((item, i) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full border text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all duration-200">
                      {item} →
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Just launched</span>
            </div>
          </div>
        </div>

        {/* DISCOVER ROLES */}
        <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Discover internships across popular roles
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {[
                  { title: "Full Stack", icon: "💻", color: "bg-blue-100" },
                  { title: "Data Science", icon: "📊", color: "bg-green-100" },
                  { title: "Machine Learning", icon: "🤖", color: "bg-purple-100" },
                  { title: "Cloud Computing", icon: "☁️", color: "bg-cyan-100" },
                  { title: "Cybersecurity", icon: "🔒", color: "bg-red-100" },
                  { title: "Product Design", icon: "🎨", color: "bg-pink-100" },
                ].map((role, i) => (
                  <div 
                    key={i} 
                    className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${role.color} flex items-center justify-center text-2xl`}>
                      {role.icon}
                    </div>
                    <h3 className="text-gray-900 font-semibold text-base">{role.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* INTERNSHIPS */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Internships</h2>
            <span className="text-sm text-gray-500">{filtered.length} opportunities found</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAll ? filtered : filtered.slice(0, 9)).map((task, index) => {
              const isSaved = saved.includes(task._id);
              return (
                <div 
                  key={task._id} 
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 p-6 flex flex-col justify-between group"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onMouseEnter={() => setHoveredCard(task._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(task._id);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                      >
                        <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-500 font-medium">{task.employer?.name}</p>
                    <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📍</span>
                        <span>{task.locations?.join(", ") || "Multiple locations"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">💰</span>
                        <span className="font-medium">₹ {task.stipend?.toLocaleString()} / year</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🧳</span>
                        <span>{task.experience || "0 year(s)"}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium">Fresher Job</span>
                      {task.skills?.slice(0, 2).map((skill, i) => (
                        <span key={i} className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyClick(task._id)}
                    className="mt-6 w-full bg-gradient-to-r from-[#0a66c2] to-[#004182] hover:from-[#004182] hover:to-[#0a66c2] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-[1.02] shadow-md hover:shadow-lg"
                  >
                    View details →
                  </button>
                </div>
              );
            })}
          </div>
          {filtered.length > 8 && !showAll && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="px-8 py-3 rounded-full border-2 border-blue-600 bg-white text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
              >
                Explore all {filtered.length} internships →
              </button>
            </div>
          )}
        </div>

        {/* EMPLOYER PROMO BANNER */}
        <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <EmployerBanner />
        </div>

        {/* POPULAR CATEGORIES */}
        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <h2 className="text-2xl font-bold text-center text-gray-900">Explore by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Software Development", icon: "💻", jobs: "2.5K+", query: "Software Development", color: "blue" },
              { name: "Data Science", icon: "📊", jobs: "1.8K+", query: "Data Science", color: "green" },
              { name: "Marketing", icon: "📢", jobs: "1.2K+", query: "Marketing", color: "orange" },
              { name: "Design", icon: "🎨", jobs: "900+", query: "Design", color: "purple" },
              { name: "Business", icon: "💼", jobs: "1.5K+", query: "Business", color: "indigo" },
              { name: "Engineering", icon: "⚙️", jobs: "2.1K+", query: "Engineering", color: "red" },
              { name: "Content Writing", icon: "✍️", jobs: "800+", query: "Content Writing", color: "teal" },
              { name: "Finance", icon: "💰", jobs: "1.1K+", query: "Finance", color: "yellow" },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/internships?query=${encodeURIComponent(item.query)}`)}
                className="bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-xs sm:text-sm text-blue-600 mt-1 font-medium">{item.jobs} internships</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED COMPANIES */}
        <div className="space-y-8 pt-6 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
          <h2 className="text-2xl font-bold text-center text-gray-900">Featured companies actively hiring</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Tata Consultancy Services", logo: "/logos/tcs.png", query: "TCS" },
              { name: "cognizant", logo: "/logos/conizant.png", query: "Cognizant" },
              { name: "Reliance Industrie", logo: "/logos/reliance.png", query: "Reliance" },
              { name: "Amgen Inc", logo: "/logos/amgen.png", query: "Amgen" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl border-2 border-gray-100 px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <img src={item.logo} alt={item.name} className="h-10 sm:h-12 mb-4 sm:mb-6 object-contain" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{item.name}</h3>
                <button 
                  onClick={() => navigate(`/internships?query=${encodeURIComponent(item.query)}`)}
                  className="mt-4 sm:mt-6 w-full py-2 sm:py-3 rounded-full bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-all duration-300"
                >
                  View jobs
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce z-50">
            {toast}
          </div>
        )}

        {/* MODALS */}
        {applyTaskId && (
          <ApplyModal
            taskId={applyTaskId}
            onClose={() => setApplyTaskId(null)}
            onDone={() => {
              setToast("Application sent successfully 🎉");
              setTimeout(() => setToast(null), 2500);
              load();
            }}
          />
        )}

        {showLogin && (
          <Modal
            title="Login Required"
            message="Please login or register before applying."
            onClose={() => setShowLogin(false)}
            primary={{ text: "Login", action: () => navigate("/login") }}
            secondary={{ text: "Register", action: () => navigate("/register") }}
          />
        )}

        {showVerify && (
          <Modal
            title="Verification Required"
            message="You must verify your student identity before applying."
            onClose={() => setShowVerify(false)}
            primary={{ text: "Verify Now", action: () => navigate("/profile") }}
          />
        )}
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
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* ---------- Modal ---------- */
function Modal({ title, message, primary, secondary, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-center gap-3">
          {primary && (
            <button 
              onClick={primary.action} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              {primary.text}
            </button>
          )}
          {secondary && (
            <button 
              onClick={secondary.action} 
              className="border-2 border-gray-200 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
            >
              {secondary.text}
            </button>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
