import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";

export default function ForgotPasswordVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // If email missing → redirect back
  const email = location.state?.email || "";

  if (!email) {
    navigate("/forgot-password");
  }

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("⚠️ Please enter your OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://backend-drukhealth.onrender.com/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "❌ Invalid OTP.");
        return;
      }

      // SUCCESS
      alert("✅ OTP verified successfully!");
      navigate("/change-password", { state: { email } });

    } catch (err) {
      console.error("❌ OTP Verify Error:", err);
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
            Druk<span className="e-letter">e</span>Health
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <h1 className="title">Verify OTP</h1>
          <p className="subtitle">
            Enter the OTP you received. <strong>{email}</strong>
          </p>

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="email-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            onClick={handleVerify}
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
