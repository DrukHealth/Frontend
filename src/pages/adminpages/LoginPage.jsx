import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleForgotPassword = () => navigate("/forgot-password");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // ✅ Super admin vs normal admin
      const isSuperAdmin = email.endsWith("@zhiwa-ctg.app");
      const endpoint = isSuperAdmin
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/api/management/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // ✅ Check for token
      if (response.ok && data.token) {
        if (isSuperAdmin) {
          localStorage.setItem("superAdminToken", data.token);
          localStorage.setItem("superAdminEmail", data.email || email);
          alert("Super Admin Login Successful ✅");
          navigate("/dashboard");
        } else {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminEmail", data.data?.email || email);
          alert("Admin Login Successful ✅");
          navigate("/management");
        }
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Server error — please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-box">
          <img src="/logo2.png" alt="logo" />
          <h2>
            Druk <span className="e-letter">e</span>Health
          </h2>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h1>Welcome Again!</h1>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "LOG IN"}
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
