import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";

export default function ForgotPasswordVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 🌐 Central API base URL
  // const API = "http://localhost:5000";
  const API = "https://backend-drukhealth.onrender.com";

  // Extract email safely from navigation state
  const email = location.state?.email || "";

  // Prevent redirect inside render → useEffect instead
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("⚠️ Please enter your OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });

      let data = null;

      // safe JSON parsing
      try {
        data = await res.json();
      } catch (err) {
        console.error("JSON Parse Error:", err);
        setError("⚠️ Invalid server response.");
        return;
      }

      if (!res.ok) {
        setError(data.message || "❌ Invalid OTP.");
        return;
      }

      // SUCCESS
      alert("✅ OTP verified successfully!");
      navigate("/change-password", { state: { email } });

    } catch (err) {
      console.error("❌ OTP Verify Error:", err);
      setError("⚠️ Network or server error. Please try again.");
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
          <h1 className="title">Verify OTP</h1>
          <p className="subtitle">
            Enter the OTP sent to <strong>{email}</strong>
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
