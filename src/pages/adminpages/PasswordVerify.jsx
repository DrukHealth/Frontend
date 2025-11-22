import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";

export default function ForgotPasswordVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get email passed from Forgot Password page
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      alert("⚠️ Email not found. Start from Forgot Password page.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Optional: Clean up expired OTPs from memory every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:1000/auth/cleanup-expired-otps", { method: "POST" });
    }, 60 * 1000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      setError("⚠️ Please enter your OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:1000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.toString() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Invalid OTP.");
      } else {
        alert("✅ OTP verified!");
        // Navigate to Change Password page and pass email
        navigate("/change-password", { state: { email } });
      }
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      setError("⚠️ Server error. Try again later.");
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
            Druk <span className="e-letter">e</span>Health
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
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
