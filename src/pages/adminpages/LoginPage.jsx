import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleForgotPassword = () => navigate("/forgot-password");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/success");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SECTION */}
      <div className="login-left">
        <div className="logo-box">
          <img src="/logo2.png" alt="logo" />
          <h2>
            Druk <span className="e-letter">e</span>Health
          </h2>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <div className="login-box">
          <h1>Welcome Again!</h1>

          {/* EMAIL */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            LOG IN
          </button>

          <div className="forgot" onClick={handleForgotPassword}>
            Forgot Password?
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
