import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

    fetch("http://127.0.0.1:5000/admin/feedback")
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error(err));
  }, []);

  const logout = () => {
    navigate("/admin/login");
  };

  // Calculate summary stats
  const totalUsers = users.length;
  const totalFeedbacks = feedbacks.length;
  const positiveCount = feedbacks.filter(f => f.sentiment === "Positive").length;
  const neutralCount = feedbacks.filter(f => f.sentiment === "Neutral").length;
  const negativeCount = feedbacks.filter(f => f.sentiment === "Negative").length;


  const [feedbackData, setFeedbackData] = useState({ positive: 0, neutral: 0, negative: 0 });



  return (
    <div>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        
        {/* Summary Section */}
        <h2>Summary</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div style={{ background: "#f0f0f0", padding: "15px", textAlign: "center", borderRadius: "8px" }}>
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
          <div style={{ background: "#f0f0f0", padding: "15px", textAlign: "center", borderRadius: "8px" }}>
            <h3>Total Feedback</h3>
            <p>{totalFeedbacks}</p>
          </div>
          <div style={{ background: "#d4edda", padding: "15px", textAlign: "center", borderRadius: "8px" }}>
            <h3>Positive</h3>
            <p>{positiveCount}</p>
          </div>
          <div style={{ background: "#fff3cd", padding: "15px", textAlign: "center", borderRadius: "8px" }}>
            <h3>Neutral</h3>
            <p>{neutralCount}</p>
          </div>
          <div style={{ background: "#f8d7da", padding: "15px", textAlign: "center", borderRadius: "8px" }}>
            <h3>Negative</h3>
            <p>{negativeCount}</p>
          </div>
        </div>

        {/* Users Table */}
        <h2>Users</h2>
        <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Feedback Table */}
        <h2>Feedback</h2>
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Comment</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.username}</td>
                <td>{f.comment}</td>
                <td>{f.sentiment}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AdminDashboard;
