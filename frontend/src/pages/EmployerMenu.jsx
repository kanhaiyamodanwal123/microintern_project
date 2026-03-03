import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployerMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 px-3 md:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-sm md:text-base"
      >
        For employers ▾
      </button>

      {open && (
        <>
          {/* Desktop dropdown */}
          <div className="hidden md:block absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
            <button
              onClick={() => go("/employer")}
              className="w-full text-left px-4 py-3 hover:bg-gray-100"
            >
              Register as Employer
            </button>

            <button
              onClick={() => go("/login")}
              className="w-full text-left px-4 py-3 hover:bg-gray-100"
            >
              Employer Login
            </button>
          </div>

          {/* Mobile sheet */}
          <div className="md:hidden fixed inset-0 bg-black/40 z-40">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-2 animate-slide-up">
              <button
                onClick={() => go("/employer")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                Register as Employer
              </button>

              <button
                onClick={() => go("/login")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                Employer Login
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full text-center text-red-500 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
