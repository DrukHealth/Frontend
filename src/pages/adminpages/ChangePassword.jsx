// ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ChangePassword.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from OTP verification (navigation state)
  const email = location.state?.email || "";

  // API base (deployed)
  // const API = "http://localhost:5000";
  const API = "https://backend-drukhealth.onrender.com";

  // DEV avatar local path (uploaded)
  // const devAvatar = "/mnt/data/d1f2734c-2f97-4026-9231-98093c121ab9.png";

  // Redirect safely if email missing
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const validate = () => {
    setError("");
    const pwd = newPassword.trim();
    const conf = confirmPassword.trim();

    if (!pwd || !conf) {
      setError("⚠️ Please fill in both password fields.");
      return false;
    }
    if (pwd.length < 6) {
      setError("⚠️ Password must be at least 6 characters.");
      return false;
    }
    if (pwd !== conf) {
      setError("❌ Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: newPassword.trim() }),
      });

      // safe parse
      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        setError("⚠️ Server returned an unexpected response.");
        return;
      }

      if (!res.ok || !data?.success) {
        setError(data?.message || "❌ Failed to reset password.");
        return;
      }

      // success
      alert("✅ Password reset successfully. Please login with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Reset password error:", err);
      setError("⚠️ Network or server error. Please try again later.");
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
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div>
              <h1 className="change-title">Reset Password</h1>
              <p className="change-subtitle">Reset password for <strong>{email || "(no email)"}</strong></p>
            </div>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="change-input-wrapper">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="change-input"
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <div className="change-input-wrapper">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="change-input"
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            {error && <p className="error-message" role="alert">{error}</p>}

            <button type="submit" className="change-btn" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
