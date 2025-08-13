import { useState } from "react";
import API_BASE from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        localStorage.setItem("isAdmin", "true");
        setIsAdmin(true);
        setMessage(data.message);
        navigate("/admin/dashboard");
      } else if (!data.admin) {
        setMessage("Not an admin account");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin}>
        <input 
          placeholder="Username" 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{ width: "100%", marginBottom: 8, padding: 8 }} 
        />
        <input 
          placeholder="Password" 
          type="password" 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ width: "100%", marginBottom: 8, padding: 8 }} 
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
