// AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { User, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./css/AdminProfile.css";

/**
 * Lightweight JWT decode (no verification) to extract payload.
 * Accepts "Bearer <token>" or raw token.
 */
function decodeJwt(token) {
  try {
    const raw = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const payload = raw.split(".")[1];
    // atob may throw on invalid base64
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    return null;
  }
}

export default function AdminProfile({ onChangePassword }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // 1) Try reading stored values first
    const storedEmail =
      localStorage.getItem("adminEmail") ||
      localStorage.getItem("email") ||
      null;
    const storedRole =
      localStorage.getItem("adminRole") ||
      localStorage.getItem("role") ||
      null;

    if (storedEmail || storedRole) {
      if (storedEmail) setEmail(storedEmail);
      if (storedRole) setRole(storedRole);
      return;
    }

    // 2) Fallback: decode token payload for email/role
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("token") || null;
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        const maybeEmail =
          payload.email || (payload.user && payload.user.email) || payload.sub || "";
        const maybeRole =
          payload.role || (payload.user && payload.user.role) || payload.roles || "admin";

        if (maybeEmail) {
          setEmail(maybeEmail);
          localStorage.setItem("adminEmail", maybeEmail);
        }
        if (maybeRole) {
          setRole(maybeRole);
          localStorage.setItem("adminRole", maybeRole);
        }
        return;
      }
    }

    // 3) Nothing found: redirect to login (safe fallback)
    navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    // clear stored admin session keys (safe to keep other keys)
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    // redirect to login
    navigate("/login");
  };

  // Friendly display
  const displayRole = role ? role.replace("_", " ") : "Admin";
  const isSuper = role === "super_admin";

  // DEV avatar path you uploaded (use it if you want a real image)
  const devAvatar = "/mnt/data/d1f2734c-2f97-4026-9231-98093c121ab9.png";

  return (
    <div className="admin-profile-page" role="region" aria-label="Admin profile">
      <div className="profile-card">
        <div className="avatar-area">
          {/* If you have a real avatar URL in storage, prefer that */}
          {localStorage.getItem("adminAvatarUrl") ? (
            <img
              src={localStorage.getItem("adminAvatarUrl")}
              alt="Admin avatar"
              className="profile-avatar"
            />
          ) : (
            // fallback to provided dev avatar or icon
            (devAvatar && (
              <img src={devAvatar} alt="Avatar" className="profile-avatar" />
            )) || (
              (isSuper ? <Shield size={60} className="profile-icon" /> : <User size={60} className="profile-icon" />)
            )
          )}
        </div>

        <div className="profile-info">
          <h2 className="profile-role" style={{ textTransform: "capitalize" }}>
            {displayRole}
          </h2>
          <p className="profile-email">{email || "No email found"}</p>

          <div className="profile-actions">
            <button
              className="reset-password-btn"
              onClick={() => {
                if (typeof onChangePassword === "function") onChangePassword();
                else navigate("/change-password");
              }}
            >
              Re-set Password
            </button>

            <button className="logout-btn" onClick={handleLogout} title="Log out">
              <LogOut size={16} style={{ marginRight: 8 }} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
