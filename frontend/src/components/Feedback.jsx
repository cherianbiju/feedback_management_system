// src/components/Feedback.jsx
import React, { useState } from "react";
import API_BASE from "../api";

export default function Feedback() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [comment, setComment] = useState("");
  const [starRating, setStarRating] = useState("");
  const [satisfiedProduct, setSatisfiedProduct] = useState(null);
  const [satisfiedService, setSatisfiedService] = useState(null);
  const [result, setResult] = useState("");

  const submitFeedback = async () => {
    // Client-side validation
    if (
      !username ||
      !comment ||
      !starRating ||
      satisfiedProduct === null ||
      satisfiedService === null
    ) {
      setResult("Please fill all required fields before submitting.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          comment,
          star_rating: starRating,
          satisfied_product: satisfiedProduct,
          satisfied_service: satisfiedService,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(`Feedback saved! `);
        // Optionally clear the form
        setComment("");
        setStarRating("");
        setSatisfiedProduct(null);
        setSatisfiedService(null);
      } else {
        setResult(data.message || "Error submitting feedback");
      }
    } catch (err) {
      console.error(err);
      setResult("Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Feedback</h2>

      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <textarea
          placeholder="Your feedback"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Star Rating: </label>
        <select
          value={starRating}
          onChange={(e) => setStarRating(e.target.value)}
          style={{ padding: 6, marginLeft: 8 }}
        >
          <option value="">Select</option>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Satisfied with Product?</label>
        <input
          type="radio"
          name="product"
          value="yes"
          checked={satisfiedProduct === true}
          onChange={() => setSatisfiedProduct(true)}
          style={{ marginLeft: 8 }}
        /> Yes
        <input
          type="radio"
          name="product"
          value="no"
          checked={satisfiedProduct === false}
          onChange={() => setSatisfiedProduct(false)}
          style={{ marginLeft: 8 }}
        /> No
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Satisfied with Service?</label>
        <input
          type="radio"
          name="service"
          value="yes"
          checked={satisfiedService === true}
          onChange={() => setSatisfiedService(true)}
          style={{ marginLeft: 8 }}
        /> Yes
        <input
          type="radio"
          name="service"
          value="no"
          checked={satisfiedService === false}
          onChange={() => setSatisfiedService(false)}
          style={{ marginLeft: 8 }}
        /> No
      </div>

      <button onClick={submitFeedback} style={{ padding: "8px 16px" }}>
        Submit Feedback
      </button>

      <p style={{ marginTop: 12, color: "red" }}>{result}</p>
    </div>
  );
}
