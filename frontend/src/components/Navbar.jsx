import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef();

  // scroll shadow
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // close dropdown
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path) => {
    navigate(path);
    setOpen(false);
    setMobile(false);
  };

  // Navigation items based on user role
  const getNavItems = () => {
    if (!user) {
// For non-logged in users
      return [
        { label: "How It Works", path: "/how-it-works" },
        { label: "About Us", path: "/about" },
        { label: "Contact Us", path: "/contact" },
      ];
    } else if (user.role === "student") {
      // For students
      return [
        { label: "Browse Internships", path: "/internships" },
        { label: "My Applications", path: "/student" },
        { label: "Marketplace", path: "/marketplace" },
      ];
    } else if (user.role === "employer") {
      // For employers
      return [
        { label: "Browse Talent", path: "/internships" },
        { label: "My Posts", path: "/employer-dashboard" },
        { label: "Post Internship", path: "/create-task" },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div 
          onClick={() => go(user ? (user.role === "employer" ? "/employer-dashboard" : "/") : "/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800">MicroIntern</span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => go(item.path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* AUTH BUTTONS */}
          {!user && (
            <>
              <button
                onClick={() => go("/login")}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Sign In
              </button>

              <div className="relative group">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Get Started →
                </button>
                {/* Dropdown for registration options */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => go("/register")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b"
                  >
                    <p className="font-medium text-gray-900">Student</p>
                    <p className="text-xs text-gray-500">Find internships</p>
                  </button>
                  <button
                    onClick={() => go("/employer")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Employer</p>
                    <p className="text-xs text-gray-500">Hire talent</p>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* USER DROPDOWN */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">{user.name}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-60 bg-white border rounded-xl shadow-lg overflow-hidden">

                  {/* User Info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-gray-50 border-b">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'employer' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'student' ? '🎓 Student' : 
                         user.role === 'employer' ? '🏢 Employer' : '⚡ Admin'}
                      </span>
                    </div>
                  </div>

                  {/* Role-based Links */}
                  <div className="py-2">
                    {user.role === "student" && (
                      <>
                        <button
                          onClick={() => go("/student")}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                        >
                          <span className="text-lg">📊</span>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-gray-500">View applications</p>
                          </div>
                        </button>
                        <button
                          onClick={() => go("/verify")}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                        >
                          <span className="text-lg">✅</span>
                          <div>
                            <p className="font-medium">Verification</p>
                            <p className="text-xs text-gray-500">Verify your ID</p>
                          </div>
                        </button>
                        
                      </>
                    )}

                    {user.role === "employer" && (
                      <>
                        <button
                          onClick={() => go("/employer-dashboard")}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                        >
                          <span className="text-lg">📊</span>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-gray-500">Manage posts</p>
                          </div>
                        </button>
                        <button
                          onClick={() => go("/verify")}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                        >
                          <span className="text-lg">✅</span>
                          <div>
                            <p className="font-medium">Verification</p>
                            <p className="text-xs text-gray-500">Company verification</p>
                          </div>
                        </button>
                        <button
                          onClick={() => go("/create-task")}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                        >
                          <span className="text-lg">➕</span>
                          <div>
                            <p className="font-medium">Post Internship</p>
                            <p className="text-xs text-gray-500">Create new listing</p>
                          </div>
                        </button>
                      </>
                    )}

                    {user.role === "admin" && (
                      <button
                        onClick={() => go("/admin")}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                      >
                        <span className="text-lg">🛡️</span>
                        <div>
                          <p className="font-medium">Admin Panel</p>
                          <p className="text-xs text-gray-500">Manage platform</p>
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="border-t py-2">
                    <button
                      onClick={() => go("/profile")}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                    >
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="font-medium">My Profile</p>
                        <p className="text-xs text-gray-500">Edit your profile</p>
                      </div>
                    </button>

                    <button
                      onClick={() => go("/notifications")}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                    >
                      <span className="text-lg">🔔</span>
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-xs text-gray-500">View alerts</p>
                      </div>
                    </button>

                    <button
                      onClick={() => go("/messages")}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-3"
                    >
                      <span className="text-lg">💬</span>
                      <div>
                        <p className="font-medium">Messages</p>
                        <p className="text-xs text-gray-500">Chat with others</p>
                      </div>
                    </button>
                  </div>

                  <div className="border-t bg-red-50">
                    <button
                      onClick={() => {
                        logout();
                        localStorage.clear();
                        go("/login");
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-100 text-sm flex items-center gap-3"
                    >
                      <span className="text-lg">🚪</span>
                      <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs text-red-500">Log out of account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobile(!mobile)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobile ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobile && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => go(item.path)}
                className={`block w-full text-left px-4 py-3 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {user && (
            <div className="border-t px-4 py-3 space-y-1">
              <button onClick={() => go("/profile")} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                👤 My Profile
              </button>
              <button onClick={() => go("/messages")} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                💬 Messages
              </button>
              <button
                onClick={() => {
                  logout();
                  localStorage.clear();
                  go("/login");
                }}
                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

