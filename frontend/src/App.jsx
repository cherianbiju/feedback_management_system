import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Feedback from "./components/Feedback";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setUsername(null);
    setIsAdmin(false);
    window.location.href = "/signin";
  };

  return (
    <Router>
      <nav style={{
        display: "flex",
        gap: "20px",
        padding: "12px 24px",
        backgroundColor: "#282c34",
        color: "white",
        fontWeight: "bold"
      }}>
        {!username && !isAdmin && (
          <>
            <Link to="/signin" style={{ color: "white", textDecoration: "none" }}>Sign In</Link>
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Sign Up</Link>
            <Link to="/admin/login" style={{ color: "white", textDecoration: "none" }}>Admin Login</Link>
          </>
        )}

        {username && (
          <>
            <span style={{ color: "white" }}>Welcome, {username}</span>
            <button 
              onClick={handleLogout} 
              style={{
                marginLeft: 12,
                padding: "4px 8px",
                cursor: "pointer",
                backgroundColor: "#e63946",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Logout
            </button>
          </>
        )}

        {isAdmin && (
          <>
            <span style={{ color: "white" }}>Admin Dashboard</span>
            <button 
              onClick={handleLogout} 
              style={{
                marginLeft: 12,
                padding: "4px 8px",
                cursor: "pointer",
                backgroundColor: "#e63946",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
        <Routes>
          <Route path="/" element={<div>Welcome — open Sign In or Sign Up</div>} />
          <Route path="/signin" element={<SignIn setUsername={setUsername} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
