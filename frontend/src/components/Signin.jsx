import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api";

export default function SignIn({ setUsername }) {
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Signing in...");

    try {
      const res = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Login successful");
        localStorage.setItem("username", username);
        setUsername(username);  // <-- Update App state immediately
        navigate("/feedback");
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: 8 }}>
          <input
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            placeholder="Username"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>Sign In</button>
      </form>
      <p style={{ marginTop: 12 }}>{message}</p>
    </div>
  );
}
