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
  const otp = location.state?.otp || "";

  const handleResetPassword = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/auth/reset-password-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
      } else {
        alert("✅ Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-container">
      <div className="change-left-panel">
        <div className="change-logo-container">
          <img src="/2.png" alt="Druk Health Logo" className="change-logo" />
          <div className="change-brand-name">DRUK HEALTH</div>
        </div>
      </div>

      <div className="change-right-panel">
        <div className="change-form-container">
          <h1 className="change-title">Change Password</h1>
          <p className="change-subtitle">New password should not be same as previous password.</p>

          <div className="change-input-wrapper">
            <input
              type="password"
              placeholder="Enter New Password"
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

          <button onClick={handleResetPassword} className="change-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
