import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/ChangePassword.css";

export default function ChangePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email from OTP verification flow
  const resetEmail = location.state?.email || null;

  useEffect(() => {
    if (!resetEmail) {
      alert("⚠️ Email not found. Please start from OTP verification page.");
      navigate("/forgot-password");
    }
  }, [resetEmail, navigate]);

  const handleChangePassword = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("⚠️ Please fill in all required fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = "http://localhost:1000/auth/reset-password";
      const body = { email: resetEmail, newPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Failed to reset password");
      } else {
        alert("✅ Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("⚠️ Error:", err);
      setError("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-container">
      <div className="change-left-panel">
        <img src="/logo2.png" alt="Druk eHealth Logo" className="change-logo" />
        <div className="change-brand-name">
          Druk <span className="e-letter">e</span>Health
        </div>
      </div>

      <div className="change-right-panel">
        <div className="change-form-container">
          <h1 className="change-title">Reset Password</h1>
          <p className="change-subtitle">
            Enter a new password for your account.
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
            onClick={handleChangePassword}
            className="change-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
