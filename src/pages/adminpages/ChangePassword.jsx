import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ChangePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* ----------------------------------------------------
     🧩 Handle Password Change
  ---------------------------------------------------- */
  const handleChangePassword = async () => {
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("⚠️ Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ New passwords do not match");
      return;
    }

    // ✅ Get token (from either super admin or admin)
    const token =
      localStorage.getItem("superAdminToken") ||
      localStorage.getItem("adminToken");

    if (!token) {
      alert("⚠️ Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Important
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Failed to change password");
      } else {
        alert("✅ Password changed successfully!");
        // Optional: clear tokens to force re-login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("superAdminToken");
        navigate("/login");
      }
    } catch (err) {
      console.error("⚠️ Error changing password:", err);
      setError("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     💻 UI
  ---------------------------------------------------- */
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
            Enter your current password and choose a new one.
          </p>

          <div className="change-input-wrapper">
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="change-input"
            />
          </div>

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
