import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import './css/ChangePassword.css';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = () => {
    // (You can add real backend logic later)
    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    // Temp: just simulate success
    alert("✅ Password reset successfully!");

    // Redirect to login after alert
    navigate('/login');
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
          
          <p className="change-subtitle">
            New password should not be same as previous password.
          </p>

          <div className="change-input-wrapper">
            <FaLock className="change-input-icon" />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="change-input"
            />
          </div>

          <div className="change-input-wrapper">
            <FaLock className="change-input-icon" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="change-input"
            />
          </div>
          
          <button onClick={handleResetPassword} className="change-btn">
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
