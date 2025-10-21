import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();  // ✅ must be added

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // ✅ navigate to next screen
    navigate("/forgot-password-verify");
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo-container">
          <img src="/2.png" alt="Druk Health Logo" className="logo" />
          <div className="brand-name">DRUK HEALTH</div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <h1 className="title">Forgot Password</h1>

          <p className="subtitle">
            Enter the email address associated with your account.
          </p>

          <div className="input-wrapper">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="#666" strokeWidth="1.5" fill="none"/>
              <path d="M18 5l-8 5-8-5" stroke="#666" strokeWidth="1.5" fill="none"/>
            </svg>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
          </div>

          <button onClick={handleSubmit} className="submit-btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
