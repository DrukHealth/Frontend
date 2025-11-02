import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";

export default function ForgotPasswordVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const handleVerify = async () => {
    if (!otp) {
      setError("⚠️ Please enter your OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message || "❌ Invalid OTP.");
      else {
        alert("✅ OTP verified!");
        navigate("/change-password", { state: { email } });
      }
    } catch (err) {
      console.error(err);
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
          <h1 className="title">Verify OTP</h1>
          <p className="subtitle">Enter the OTP sent to your email address.</p>

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
