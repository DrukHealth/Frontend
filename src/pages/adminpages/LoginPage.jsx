import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
      {/* LEFT SECTION */}
      <div className="login-left">
        <div className="logo-box">
          <img src="/2.png" alt="logo" />
          <h2>DRUK HEALTH</h2>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <div className="login-box">
          <h1>Welcome Again!</h1>

          {/* EMAIL */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email" />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn">LOG IN</button>

          <div className="forgot" onClick={handleForgotPassword}>
            Forgot Password?
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
