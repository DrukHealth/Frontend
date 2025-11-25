// ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🌐 Central API URL
  // const API = "http://localhost:5000";
  const API = "https://backend-drukhealth.onrender.com";

  /**
   * 🔹 Handle OTP Request
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("⚠️ Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      // Try parsing JSON safely
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        setError("⚠️ Server returned invalid JSON. Check backend logs.");
        return;
      }

      // Error from backend
      if (!res.ok) {
        setError(data.message || "❌ Failed to send OTP");
        return;
      }

      // SUCCESS 🎉
      alert("✅ OTP has been sent to your email!");
      navigate("/forgot-password-verify", { state: { email: trimmedEmail } });

    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setError("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="logo-container">
          <img src="/logo2.png" alt="Druk Health Logo" className="logo" />
          <div className="brand-name">
            Druk<span className="e-letter">e</span>Health
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="form-container">
          <h1 className="title">Forgot Password</h1>
          <p className="subtitle">
            Enter your registered admin email to receive an OTP.
          </p>

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
