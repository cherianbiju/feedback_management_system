import { useState } from "react";
import API_BASE from "../api";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("Signing up...");

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Signup successful");
      } else {
        setMessage(data.message || "Signup error: " + (data.message || ""));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} autoComplete="off">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          type="tel"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: 12 }}>{message}</p>
    </div>
  );
}
