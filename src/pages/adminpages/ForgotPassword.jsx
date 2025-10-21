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
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
      } else {
        alert("✅ OTP sent to your email!");
        navigate("/forgot-password-verify", { state: { email } });
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo-container">
          <img src="/2.png" alt="Druk Health Logo" className="logo" />
          <div className="brand-name">DRUK HEALTH</div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <h1 className="title">Forgot Password</h1>
          <p className="subtitle">Enter the email address associated with your account.</p>

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
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
