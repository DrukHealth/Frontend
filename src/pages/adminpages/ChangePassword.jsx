import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/ChangePassword.css";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const handleResetPassword = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "❌ Failed to reset password");
      } else {
        alert("✅ Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
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
          <h1 className="change-title">Change Password</h1>
          <p className="change-subtitle">
            Your new password should be different from your previous password.
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
