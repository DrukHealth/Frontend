import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("⚠️ Please enter your email.");
      return;
    }

    setLoading(true);
    console.log("🔍 Sending OTP request for email:", trimmedEmail);

    try {
      const res = await fetch("http://localhost:5001/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();
      console.log("📥 Response:", res.status, data);

      if (!res.ok) setError(data.message || "❌ Failed to send OTP");
      else {
        alert("✅ OTP has been sent to your email!");
        navigate("/forgot-password-verify", { state: { email: trimmedEmail } });
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setError("⚠️ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo-container">
          <img src="/logo2.png" alt="Druk Health Logo" className="logo" />
          <div className="brand-name">
            DRUK H<span className="e-letter">E</span>ALTH
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <h1 className="title">Forgot Password</h1>
          <p className="subtitle">Enter your registered email to receive an OTP.</p>

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
