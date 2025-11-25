import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ChangePassword.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from OTP verification
  const email = location.state?.email || "";

  if (!email) {
    navigate("/forgot-password");
  }

  const handleResetPassword = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("⚠️ Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:1000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Failed to reset password");
      } else {
        alert("✅ Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("⚠️ Error resetting password:", err);
      setError("⚠️ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-container">
      {/* LEFT PANEL */}
      <div className="change-left-panel">
        <img src="/logo2.png" alt="Druk eHealth Logo" className="change-logo" />
        <div className="change-brand-name">
          Druk <span className="e-letter">e</span>Health
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="change-right-panel">
        <div className="change-form-container">
          <h1 className="change-title">Reset Password</h1>
          <p className="change-subtitle">
            Enter your new password.
          </p>

          <div className="change-input-wrapper">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="change-input"
            />
          </div>

          <div className="change-input-wrapper">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="change-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            onClick={handleResetPassword}
            className="change-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
