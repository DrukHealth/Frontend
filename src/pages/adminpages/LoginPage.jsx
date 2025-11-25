import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./css/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⭐ Your deployed backend URL
  const NODE_API = "https://backend-drukhealth.onrender.com";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${NODE_API}/api/manage/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ⭐ Store everything properly for later usage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", data.data.email);
        localStorage.setItem("adminRole", data.data.role);

        alert(
          `Login Successful! Welcome ${
            data.data.role === "super_admin" ? "Super Admin" : "Admin"
          } ✅`
        );

        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Logo Section */}
      <div className="login-left">
        <div className="logo-box">
          <img src="/logo2.png" alt="logo" />
          <h2>
            Druk <span className="e-letter">e</span>Health
          </h2>
        </div>
      </div>

      {/* Form Section */}
      <div className="login-right">
        <div className="login-box">
          <h1>Welcome Back!</h1>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "LOG IN"}
          </button>

          <div className="forgot-password-container">
            <span onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
