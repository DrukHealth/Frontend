import React from "react";
import { User } from "lucide-react";

export default function AdminProfile({ onChangePassword }) {
  return (
    <div className="admin-profile-page">
      <div className="profile-header">
        <User size={60} className="profile-icon" />
        <h2>Admin</h2>
        <p>admin@example.com</p>
      </div>
      <button className="reset-password-btn" onClick={onChangePassword}>
        Re-set Password
      </button>
    </div>
  );
}
