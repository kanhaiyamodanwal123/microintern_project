import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegisterStudent from "./pages/RegisterStudent";
import RegisterEmployer from "./pages/RegisterEmployer";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyStudent from "./pages/VerifyStudent";
import TaskMarketplace from "./pages/TaskMarketplace";
import CreateTask from "./pages/CreateTask";
import Notifications from "./pages/Notifications";
import Portfolio from "./pages/Portfolio";
import TaskDetails from "./pages/TaskDetails";
import EditTask from "./pages/EditTask";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Conversations from "./pages/Conversations";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import PublicInternships from "./pages/InternshipDashboard";
import SavedInternships from "./pages/SavedInternships";
import InternshipDetails from "./pages/InternshipDetails";
import InternshipSearch from "./pages/InternshipSearch";
import Footer from "./components/Footer";
import HowItWorks from "./pages/HowItWorks";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
export default function App() {
  return (
    <BrowserRouter>

      {/* Navbar visible everywhere */}
      <Navbar />

      {/* padding so navbar doesn't overlap pages */}
      <div className="pt-16">

        <Routes>

          {/* PUBLIC ROUTES (blocked if logged in) */}

          <Route
            path="/"
            element={
             <PublicInternships />
                
      
            }
          />

          <Route
            path="/employer"
            element={
              <PublicRoute>
                <RegisterEmployer />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* PROTECTED ROUTES */}

          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <VerifyStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-task"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/task/:id"
            element={
              <ProtectedRoute>
                <TaskDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <TaskMarketplace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:taskId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route path="/register" element={
            <PublicRoute><RegisterStudent /></PublicRoute>
            
            } />
           
           <Route path="/saved" element={<SavedInternships />} />
<Route path="/internship/:id" element={<InternshipDetails />} />
          <Route path="/internships" element={<InternshipSearch />} />

<Route path="/how-it-works" element={<HowItWorks />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300">404</h1>
                <p className="text-xl text-gray-500 mt-4">Page Not Found</p>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go Back
                </button>
              </div>
            </div>
          } />

        </Routes>

      </div>
      <Footer />
    </BrowserRouter>
  );
}
