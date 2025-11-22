import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./css/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const LOCAL_BACKEND = "http://localhost:1000";
  const DEPLOYED_BACKEND = "https://backend-drukhealth.onrender.com";
  const NODE_API =
    window.location.hostname === "localhost" ? LOCAL_BACKEND : DEPLOYED_BACKEND;

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${NODE_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert("Login failed — server returned unexpected response.");
        setLoading(false);
        return;
      }

      if (response.ok && data.token) {
        const expiry = Date.now() + 30 * 60 * 1000;
        localStorage.setItem("tokenExpiry", expiry);

        const role = data.data?.role;

        if (role === "superadmin") {
          localStorage.setItem("superAdminToken", data.token);
          localStorage.setItem("superAdminEmail", data.data.email || email);
          alert("Super Admin Login Successful ✅");
          navigate("/dashboard");
        } else if (role === "admin") {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminEmail", data.data.email || email);
          alert("Admin Login Successful ✅");
          navigate("/management");
        } else {
          alert("Unknown user role. Contact administrator.");
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

  useEffect(() => {
    const checkSession = () => {
      const expiry = localStorage.getItem("tokenExpiry");
      if (expiry && Date.now() > Number(expiry)) {
        localStorage.clear();
        alert("⚠️ Session expired. Please log in again.");
        navigate("/login");
      }
    };
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

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
          <h1>Welcome Back!</h1>

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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Eye icon removed entirely */}
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOG IN"}
          </button>

          <div
            className="forgot"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
